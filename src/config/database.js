const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres',
		logging: false,
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false
			}
		},
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000
		}
	});
} else {
	sequelize = new Sequelize(
		process.env.DB_NAME,
		process.env.DB_USER,
		process.env.DB_PASSWORD,
		{
			host: process.env.DB_HOST,
			port: process.env.DB_PORT,
			dialect: 'postgres',
			logging: false,
			pool: {
				max: 5,
				min: 0,
				acquire: 30000,
				idle: 10000
			}
		}
	);
}

module.exports = sequelize; 