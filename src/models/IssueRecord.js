const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const IssueRecord = sequelize.define('IssueRecord', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    issue_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'issues',
        key: 'id'
      }
    },
    record_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'records',
        key: 'id'
      }
    },
    score: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 1
      }
    },
    severity: {
      type: DataTypes.ENUM('high', 'medium', 'low'),
      allowNull: false
    },
    savings_time: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    savings_bytes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    details: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'issue_records',
    indexes: [
      {
        unique: true,
        fields: ['issue_id', 'record_id']
      }
    ]
  });

  IssueRecord.associate = (models) => {
    IssueRecord.belongsTo(models.Issue, {
      foreignKey: 'issue_id',
      as: 'issue'
    });
    IssueRecord.belongsTo(models.Record, {
      foreignKey: 'record_id',
      as: 'record'
    });
  };

  return IssueRecord;
}; 