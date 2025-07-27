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
    },
    first_contentful_paint: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: 'First Contentful Paint in seconds (e.g., 1.5)'
    },
    largest_contentful_paint: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: 'Largest Contentful Paint in seconds (e.g., 1.8)'
    },
    total_blocking_time: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Total Blocking Time in milliseconds (e.g., 210)'
    },
    cumulative_layout_shift: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: 'Cumulative Layout Shift score (e.g., 0.169)'
    },
    speed_index: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: 'Speed Index in seconds (e.g., 2.9)'
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