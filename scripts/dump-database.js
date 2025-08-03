const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASSWORD,
	{
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: 'postgres',
		logging: false
	}
);

async function dumpDatabase() {
	try {
		console.log('Connecting to database...');
		await sequelize.authenticate();
		console.log('Database connection established.');

		console.log('Generating SQL dump...');

		let sqlDump = '';

		// Get all table names
		const tables = await sequelize.query(
			"SELECT tablename FROM pg_tables WHERE schemaname = 'public'",
			{ type: Sequelize.QueryTypes.SELECT }
		);

		console.log(`Found ${tables.length} tables:`, tables.map(t => t.tablename));

		for (const table of tables) {
			const tableName = table.tablename;

			// Get table structure
			const structure = await sequelize.query(
				`SELECT column_name, data_type, is_nullable, column_default 
         FROM information_schema.columns 
         WHERE table_name = '${tableName}' AND table_schema = 'public'
         ORDER BY ordinal_position`,
				{ type: Sequelize.QueryTypes.SELECT }
			);

			// Create sequences first
			const sequences = await sequelize.query(
				`SELECT sequence_name FROM information_schema.sequences 
				 WHERE sequence_schema = 'public' AND sequence_name LIKE '${tableName}_%'`,
				{ type: Sequelize.QueryTypes.SELECT }
			);

			// Create sequences
			for (const seq of sequences) {
				sqlDump += `CREATE SEQUENCE IF NOT EXISTS "${seq.sequence_name}";\n`;
			}

			// Create CREATE TABLE statement (without dropping existing tables)
			sqlDump += `CREATE TABLE IF NOT EXISTS "${tableName}" (\n`;
			const columns = structure.map(col => {
				let def = `  "${col.column_name}" ${col.data_type}`;
				if (col.is_nullable === 'NO') def += ' NOT NULL';
				if (col.column_default) def += ` DEFAULT ${col.column_default}`;
				return def;
			});
			sqlDump += columns.join(',\n') + '\n);\n\n';

			// Set sequence ownership
			for (const seq of sequences) {
				sqlDump += `ALTER SEQUENCE "${seq.sequence_name}" OWNED BY "${tableName}".id;\n`;
			}
			if (sequences.length > 0) {
				sqlDump += '\n';
			}

			// Get table data
			const data = await sequelize.query(
				`SELECT * FROM "${tableName}"`,
				{ type: Sequelize.QueryTypes.SELECT }
			);

			if (data.length > 0) {
				console.log(`Dumping ${data.length} rows from ${tableName}`);

				// Create INSERT statements
				const columns = Object.keys(data[0]);
				sqlDump += `INSERT INTO "${tableName}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES\n`;

				const values = data.map(row => {
					const rowValues = columns.map(col => {
						const value = row[col];
						if (value === null) return 'NULL';
						if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
						if (typeof value === 'boolean') return value ? 'true' : 'false';
						return value;
					});
					return `  (${rowValues.join(', ')})`;
				});

				sqlDump += values.join(',\n') + ';\n\n';
			}
		}

		// Write to file
		const outputPath = path.join(__dirname, '..', 'lighthouse_tracker_backup.sql');
		fs.writeFileSync(outputPath, sqlDump);

		console.log(`Database dump saved to: ${outputPath}`);
		console.log(`Total size: ${(sqlDump.length / 1024).toFixed(2)} KB`);

	} catch (error) {
		console.error('Error dumping database:', error);
	} finally {
		await sequelize.close();
	}
}

dumpDatabase(); 