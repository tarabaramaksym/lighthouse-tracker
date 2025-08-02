const { Record, Issue, IssueRecord } = require('../../models');
const lighthouse = require('lighthouse').default;
const chromeLauncher = require('chrome-launcher');
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const execAsync = promisify(exec);

class LighthouseRunner {
	constructor() {
		this.chrome = null;
	}

	async runForDomain(domain) {
		try {
			console.log(`[LighthouseRunner] Starting audit for domain: ${domain.url}`);

			const websites = await domain.getWebsites({
				where: { status: 'monitoring' }
			});

			console.log(`[LighthouseRunner] Found ${websites.length} monitoring websites for domain ${domain.url}`);

			for (const website of websites) {
				await this.runForWebsite(website);
			}

			console.log(`[LighthouseRunner] Completed audit for domain: ${domain.url}`);
		} catch (error) {
			console.error(`[LighthouseRunner] Error running audit for domain ${domain.url}:`, error);
			throw error;
		}
	}

	async runForWebsite(website) {
		try {
			console.log(`[LighthouseRunner] Running audit for website: ${website.path}`);
			console.log(website, 'test');
			let fullUrl = `${website.domain.url}${website.path}`;

			if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
				fullUrl = `https://${fullUrl}`;
			}

			console.log(`[LighthouseRunner] Full URL: ${fullUrl}`);

			const lighthouseData = await this.runLighthouse(fullUrl);

			if (lighthouseData) {
				await this.storeResults(website, lighthouseData, false);
				console.log(`[LighthouseRunner] Successfully stored desktop results for website: ${website.path}`);
			}

			const mobileLighthouseData = await this.runLighthouse(fullUrl, true);

			if (mobileLighthouseData) {
				await this.storeResults(website, mobileLighthouseData, true);
				console.log(`[LighthouseRunner] Successfully stored mobile results for website: ${website.path}`);
			}
		} catch (error) {
			console.error(`[LighthouseRunner] Error running audit for website ${website.path}:`, error);
			throw error;
		}
	}

	async runLighthouse(url, isMobile = false) {
		try {
			console.log(`[LighthouseRunner] Launching Chrome for Lighthouse audit (${isMobile ? 'mobile' : 'desktop'})...`);

			this.chrome = await chromeLauncher.launch({
				chromeFlags: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--headless', '--disable-web-security', '--disable-features=VizDisplayCompositor']
			});

			const config = {
				extends: 'lighthouse:default',
				settings: {
					logLevel: 'info',
					output: 'json',
					onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
					maxWaitForLoad: 30000,
					timeout: 60000,
					formFactor: isMobile ? 'mobile' : 'desktop',
					throttlingMethod: 'simulate',
					maxWaitForFcp: 30000,
					pauseAfterFcpMs: 1000,
					pauseAfterLoadMs: 1000,
					networkQuietThresholdMs: 1000,
					cpuQuietThresholdMs: 1000,
					...(isMobile ? {
						screenEmulation: {
							mobile: true,
							width: 412,
							height: 823,
							deviceScaleFactor: 1.75,
							disabled: false
						},
						emulatedUserAgent: 'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36',
						throttling: {
							rttMs: 150,
							throughputKbps: 1638.4,
							requestLatencyMs: 562.5,
							downloadThroughputKbps: 1474.56,
							uploadThroughputKbps: 675,
							cpuSlowdownMultiplier: 4
						}
					} : {
						screenEmulation: {
							mobile: false,
							width: 2000,
							height: 1000,
							deviceScaleFactor: 1,
							disabled: false
						},
						emulatedUserAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
						throttling: {
							rttMs: 40,
							throughputKbps: 10240,
							requestLatencyMs: 0,
							downloadThroughputKbps: 0,
							uploadThroughputKbps: 0,
							cpuSlowdownMultiplier: 1
						}
					})
				}
			};

			console.log(`[LighthouseRunner] Running Lighthouse audit for: ${url} (${isMobile ? 'mobile' : 'desktop'})`);
			const runnerResult = await lighthouse(url, { port: this.chrome.port }, config);
			const reportJson = runnerResult.lhr;

			console.log(`[LighthouseRunner] Raw report structure:`, {
				hasReport: !!reportJson,
				hasCategories: !!(reportJson && reportJson.categories),
				categoryKeys: reportJson && reportJson.categories ? Object.keys(reportJson.categories) : [],
				hasAudits: !!(reportJson && reportJson.audits),
				auditCount: reportJson && reportJson.audits ? Object.keys(reportJson.audits).length : 0
			});

			if (!reportJson || !reportJson.categories) {
				throw new Error('Invalid Lighthouse report structure');
			}

			console.log(`[LighthouseRunner] Lighthouse audit completed successfully (${isMobile ? 'mobile' : 'desktop'})`);

			this.saveRawLighthouseData(url, reportJson, isMobile);

			return this.parseLighthouseResults(reportJson);
		} catch (error) {
			console.error(`[LighthouseRunner] Lighthouse execution error for ${url} (${isMobile ? 'mobile' : 'desktop'}):`, error);
			throw error;
		} finally {
			if (this.chrome) {
				try {
					await this.chrome.kill();
				} catch (killError) {
					console.warn(`[LighthouseRunner] Error killing Chrome:`, killError);
				}
				this.chrome = null;
			}
		}
	}

	parseLighthouseResults(reportJson) {
		try {
			console.log(`[LighthouseRunner] Starting to parse Lighthouse results...`);

			const categories = reportJson.categories;
			const audits = reportJson.audits;

			console.log(`[LighthouseRunner] Available categories:`, Object.keys(categories));

			const scores = {
				performance_score: this.calculateCategoryScore(categories.performance, audits),
				accessibility_score: this.calculateCategoryScore(categories.accessibility, audits),
				best_practices_score: this.calculateCategoryScore(categories['best-practices'], audits),
				seo_score: this.calculateCategoryScore(categories.seo, audits),
				pwa_score: this.calculateCategoryScore(categories.pwa, audits)
			};

			console.log(`[LighthouseRunner] Calculated scores:`, scores);

			const metrics = {
				first_contentful_paint: this.extractMetric(audits, 'first-contentful-paint'),
				largest_contentful_paint: this.extractMetric(audits, 'largest-contentful-paint'),
				total_blocking_time: this.extractMetric(audits, 'total-blocking-time'),
				cumulative_layout_shift: this.extractMetric(audits, 'cumulative-layout-shift'),
				speed_index: this.extractMetric(audits, 'speed-index')
			};

			const issues = this.extractIssues(audits);

			return {
				scores,
				metrics,
				issues
			};
		} catch (error) {
			console.error(`[LighthouseRunner] Error parsing Lighthouse results:`, error);
			throw error;
		}
	}

	extractMetric(audits, metricName) {
		const audit = audits[metricName];
		if (!audit || !audit.numericValue) {
			return null;
		}

		let value = audit.numericValue;

		if (metricName === 'total-blocking-time') {
			return Math.round(value);
		} else if (metricName === 'cumulative-layout-shift') {
			return parseFloat(value.toFixed(3));
		} else {
			return parseFloat((value / 1000).toFixed(2));
		}
	}

	extractIssues(audits) {
		const issues = [];

		for (const [auditId, audit] of Object.entries(audits)) {
			if (audit.score !== null && audit.score < 1 && audit.title && audit.description) {
				const category = this.getCategoryFromAuditId(auditId);

				if (category) {
					const issueData = {
						issue_id: auditId,
						title: audit.title,
						description: audit.description,
						category,
						score: audit.score,
						severity: this.getSeverityFromScore(audit.score),
						details: audit.details || {}
					};

					if (audit.details && audit.details.type === 'opportunity') {
						issueData.savings_time = audit.details.overallSavingsMs;
						issueData.savings_bytes = audit.details.overallSavingsBytes;
					}

					issues.push(issueData);
				}
			}
		}

		return issues;
	}

	calculateCategoryScore(category, audits) {
		if (!category || !category.auditRefs || !audits) {
			return 0;
		}

		let totalWeight = 0;
		let weightedScore = 0;

		for (const auditRef of category.auditRefs) {
			const audit = audits[auditRef.id];
			if (audit && audit.score !== null && audit.score !== undefined && auditRef.weight > 0) {
				totalWeight += auditRef.weight;
				weightedScore += audit.score * auditRef.weight;
			}
		}

		if (totalWeight === 0) {
			return 0;
		}

		const finalScore = Math.round((weightedScore / totalWeight) * 100);
		console.log(`[LighthouseRunner] Category ${category.title} score: ${finalScore} (weighted: ${weightedScore}/${totalWeight})`);
		return finalScore;
	}

	saveRawLighthouseData(url, reportJson, isMobile) {
		try {
			const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
			const urlSafe = url.replace(/[^a-zA-Z0-9]/g, '_');
			const deviceType = isMobile ? 'mobile' : 'desktop';
			const filename = `lighthouse_raw_${urlSafe}_${deviceType}_${timestamp}.json`;
			const filepath = path.join(__dirname, '..', '..', '..', 'lighthouse_debug', filename);

			const dir = path.dirname(filepath);
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir, { recursive: true });
			}

			fs.writeFileSync(filepath, JSON.stringify(reportJson, null, 2));
			console.log(`[LighthouseRunner] Saved raw Lighthouse data to: ${filepath}`);
		} catch (error) {
			console.warn(`[LighthouseRunner] Failed to save raw Lighthouse data:`, error);
		}
	}

	getCategoryFromAuditId(auditId) {
		if (auditId.includes('performance') || auditId.includes('speed') || auditId.includes('time')) {
			return 'performance';
		} else if (auditId.includes('accessibility') || auditId.includes('a11y')) {
			return 'accessibility';
		} else if (auditId.includes('best-practices') || auditId.includes('security')) {
			return 'best-practices';
		} else if (auditId.includes('seo')) {
			return 'seo';
		} else if (auditId.includes('pwa') || auditId.includes('service-worker')) {
			return 'pwa';
		}
		return null;
	}

	getSeverityFromScore(score) {
		if (score < 0.5) return 'high';
		if (score < 0.9) return 'medium';
		return 'low';
	}

	async storeResults(website, lighthouseData, isMobile = false) {
		const { sequelize } = require('../../models');
		const transaction = await sequelize.transaction();

		try {
			const record = await Record.create({
				website_id: website.id,
				is_mobile: isMobile,
				...lighthouseData.scores,
				...lighthouseData.metrics
			}, { transaction });

			await this.storeIssues(record, lighthouseData.issues, transaction);

			await transaction.commit();
			return record;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async storeIssues(record, issues, transaction) {
		for (const issueData of issues) {
			let issue = await Issue.findOne({
				where: { issue_id: issueData.issue_id }
			});

			if (!issue) {
				issue = await Issue.create({
					issue_id: issueData.issue_id,
					title: issueData.title,
					description: issueData.description,
					category: issueData.category
				}, { transaction });
			}

			await IssueRecord.create({
				issue_id: issue.id,
				record_id: record.id,
				score: issueData.score,
				severity: issueData.severity,
				details: issueData.details
			}, { transaction });
		}
	}
}

module.exports = LighthouseRunner; 
