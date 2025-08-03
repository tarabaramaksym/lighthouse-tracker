const CronService = require('../src/services/cron/CronService');

async function runTestAudits() {
	console.log('🚀 Starting Lighthouse Audit Test Script...');

	const cronService = new CronService();

	try {
		console.log('📊 Running test audits for all domains...');
		await cronService.testExecuteScheduledAudits();
		console.log('✅ Test audits completed successfully!');
	} catch (error) {
		console.error('❌ Test audits failed:', error);
		process.exit(1);
	}
}

runTestAudits(); 