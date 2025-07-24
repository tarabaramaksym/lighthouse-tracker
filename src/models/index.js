const sequelize = require('../config/database');

const User = require('./User')(sequelize);
const Domain = require('./Domain')(sequelize);
const Website = require('./Website')(sequelize);
const Record = require('./Record')(sequelize);
const Issue = require('./Issue')(sequelize);
const IssueRecord = require('./IssueRecord')(sequelize);

const models = {
  User,
  Domain,
  Website,
  Record,
  Issue,
  IssueRecord
};

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  ...models
}; 