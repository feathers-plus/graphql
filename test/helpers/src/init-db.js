
const initNonSqlDb = require('./init-non-sql-db');
const initSqlDb = require('./init-sql-db');

module.exports = function InitDb (app) {
  return initNonSqlDb(app)
    .then(() => initSqlDb(app));
};
