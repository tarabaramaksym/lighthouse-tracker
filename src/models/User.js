const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	const User = sequelize.define('User', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		is_read_only: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		plan: {
			type: DataTypes.ENUM('free', 'pro', 'pro-plus'),
			allowNull: false,
			defaultValue: 'free'
		}
	}, {
		timestamps: true,
		tableName: 'users'
	});

	User.associate = (models) => {
		User.hasMany(models.Domain, {
			foreignKey: 'user_id',
			as: 'domains'
		});
	};

	return User;
}; 