const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { sequelize } = require('./models');
const { generalLimiter } = require('./middleware/rateLimit');
const CronService = require('./services/cron/CronService');

const app = express();

app.set('trust proxy', true);

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
	app.use(generalLimiter);
}

const routes = require('./routes');

app.use('/api', routes);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

	app.get('/{*any}', (req, res) => {
		res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
	});
}

const initializeDatabase = async () => {
	try {
		await sequelize.authenticate();
		console.log('Database connection established successfully.');

		await sequelize.sync({ alter: true });
		console.log('Database models synchronized.');
	} catch (error) {
		console.error('Database initialization error:', error);
	}
};

const initializeCronService = () => {
	if (process.env.CRON_ENABLED !== 'false') {
		const cronService = new CronService();
		cronService.start();
		console.log('Cron service initialized.');
	} else {
		console.log('Cron service disabled via environment variable.');
	}
};

initializeDatabase().then(() => {
	initializeCronService();
});

module.exports = app; 