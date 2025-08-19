const { Sequelize } = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(
  config.mysql.database,
  config.mysql.user,
  config.mysql.password,
  {
    host: config.mysql.host,
    port: config.mysql.port,
    dialect: 'mysql',
    logging: false,
  }
);

// Import models
const User = require('./user.model')(sequelize);
const Token = require('./token.model')(sequelize);

const db = {
  sequelize,
  Sequelize,
  User,
  Token,
};

module.exports = db;
