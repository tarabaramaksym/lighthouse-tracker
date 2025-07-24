const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Issue = sequelize.define('Issue', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    issue_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('performance', 'accessibility', 'best-practices', 'seo', 'pwa'),
      allowNull: false
    }
  }, {
    timestamps: true,
    tableName: 'issues'
  });

  Issue.associate = (models) => {
    Issue.belongsToMany(models.Record, {
      through: models.IssueRecord,
      foreignKey: 'issue_id',
      as: 'records'
    });
  };

  return Issue;
}; 