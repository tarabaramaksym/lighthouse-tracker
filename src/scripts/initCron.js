require('dotenv').config();
const { sequelize } = require('../models');
const CronService = require('../services/cron/CronService');

const initializeDatabase = async () => {
	try {
		await sequelize.authenticate();
		console.log('Database connection established successfully.');

		await sequelize.sync({ alter: true });
		console.log('Database models synchronized.');
	} catch (error) {
		console.error('Database initialization error:', error);
		process.exit(1);
	}
};

const initializeCronService = () => {
	if (process.env.CRON_ENABLED !== 'false') {
		const cronService = new CronService();
		cronService.start();
		console.log('Cron service initialized and running independently.');
	} else {
		console.log('Cron service disabled via environment variable.');
		process.exit(0);
	}
};

// Main execution
const main = async () => {
	console.log('Starting standalone cron service...');
	await initializeDatabase();
	initializeCronService();
};

main().catch(error => {
	console.error('Failed to start cron service:', error);
	process.exit(1);
});
