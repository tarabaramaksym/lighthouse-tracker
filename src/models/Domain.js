const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Domain = sequelize.define('Domain', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    tableName: 'domains',
    indexes: [
      {
        unique: true,
        fields: ['url', 'user_id']
      }
    ]
  });

  Domain.associate = (models) => {
    Domain.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    Domain.hasMany(models.Website, {
      foreignKey: 'domain_id',
      as: 'websites'
    });
  };

  return Domain;
}; 