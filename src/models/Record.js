const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Record = sequelize.define('Record', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    website_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'websites',
        key: 'id'
      }
    },
    performance_score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
    },
    accessibility_score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
    },
    best_practices_score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
    },
    seo_score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
    },
    pwa_score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
    }
  }, {
    timestamps: true,
    tableName: 'records'
  });

  Record.associate = (models) => {
    Record.belongsTo(models.Website, {
      foreignKey: 'website_id',
      as: 'website'
    });
    Record.belongsToMany(models.Issue, {
      through: models.IssueRecord,
      foreignKey: 'record_id',
      as: 'issues'
    });
  };

  return Record;
}; 