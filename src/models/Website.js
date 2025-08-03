const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	const Website = sequelize.define('Website', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		path: {
			type: DataTypes.STRING,
			allowNull: false
		},
		domain_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'domains',
				key: 'id'
			}
		},
		status: {
			type: DataTypes.ENUM('monitoring', 'ignored', '404'),
			allowNull: false,
			defaultValue: 'monitoring'
		}
	}, {
		timestamps: true,
		tableName: 'websites',
		indexes: [
			{
				unique: true,
				fields: ['path', 'domain_id']
			}
		]
	});

	Website.associate = (models) => {
		Website.belongsTo(models.Domain, {
			foreignKey: 'domain_id',
			as: 'domain'
		});
		Website.hasMany(models.Record, {
			foreignKey: 'website_id',
			as: 'records'
		});
	};

	return Website;
}; 