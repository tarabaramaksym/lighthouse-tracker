const cron = require('node-cron');
const { Domain, Website } = require('../../models');
const LighthouseRunner = require('./LighthouseRunner');

class CronService {
	constructor() {
		this.isRunning = false;
		this.lighthouseRunner = new LighthouseRunner();
	}

	start() {
		if (this.isRunning) {
			console.log('[CronService] Cron service is already running');
			return;
		}

		console.log('[CronService] Starting cron service...');

		const cronJob = cron.schedule('*/15 * * * *', async () => {
			await this.executeScheduledAudits();
		}, {
			scheduled: true,
			timezone: process.env.TZ || 'UTC'
		});
		this.isRunning = true;
		console.log('[CronService] Cron service started successfully');

		return cronJob;
	}

	stop() {
		if (!this.isRunning) {
			console.log('[CronService] Cron service is not running');
			return;
		}

		console.log('[CronService] Stopping cron service...');
		this.isRunning = false;
	}

	async executeScheduledAudits() {
		try {
			const currentTime = new Date();
			const timeString = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;

			console.log(`[CronService] Checking for domains scheduled at ${timeString}`);

			const domainsToAudit = await Domain.findAll({
				where: {
					lighthouse_schedule: timeString,
					status: 'active'
				},
				include: [{
					model: Website,
					as: 'websites',
					where: { status: 'monitoring' },
					required: true
				}]
			});

			console.log(`[CronService] Found ${domainsToAudit.length} domains to audit`);

			for (const domain of domainsToAudit) {
				try {
					const websites = await domain.getWebsites({
						where: { status: 'monitoring' },
						include: [{
							model: Domain,
							as: 'domain'
						}]
					});

					for (const website of websites) {
						try {
							await this.lighthouseRunner.runForWebsite(website);
						} catch (error) {
							console.error(`[CronService] Failed to audit website ${website.path}:`, error);
						}
					}
				} catch (error) {
					console.error(`[CronService] Failed to audit domain ${domain.url}:`, error);
				}
			}

			console.log(`[CronService] Completed scheduled audits for ${timeString}`);
		} catch (error) {
			console.error('[CronService] Error executing scheduled audits:', error);
		}
	}

	async testExecuteScheduledAudits() {
		try {
			console.log(`[CronService] TEST MODE: Running audits for ALL domains and websites`);

			const allDomains = await Domain.findAll({
				where: {
					status: 'active'
				},
				include: [{
					model: Website,
					as: 'websites',
					where: { status: 'monitoring' },
					required: true
				}]
			});

			console.log(`[CronService] TEST MODE: Found ${allDomains.length} active domains with monitoring websites`);

			for (const domain of allDomains) {
				try {
					console.log(`[CronService] TEST MODE: Auditing domain: ${domain.url}`);

					const websites = await domain.getWebsites({
						where: { status: 'monitoring' },
						include: [{
							model: Domain,
							as: 'domain'
						}]
					});

					for (const website of websites) {
						try {
							await this.lighthouseRunner.runForWebsite(website);
						} catch (error) {
							console.error(`[CronService] TEST MODE: Failed to audit website ${website.path}:`, error);
						}
					}

					console.log(`[CronService] TEST MODE: Successfully completed audit for domain: ${domain.url}`);
				} catch (error) {
					console.error(`[CronService] TEST MODE: Failed to audit domain ${domain.url}:`, error);
				}
			}

			console.log(`[CronService] TEST MODE: Completed audits for all domains`);
		} catch (error) {
			console.error('[CronService] TEST MODE: Error executing test audits:', error);
		}
	}


}

module.exports = CronService; 