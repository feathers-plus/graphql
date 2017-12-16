
const deepMerge = require('deepmerge');

const userJoins = require('./user-joins');
const generatedSqlJoins = require('./generated-sql-joins');

module.exports = function (app, options) {
  return deepMerge.all([
    generatedSqlJoins(app, options),
    userJoins(app, options), // This is how you would add modules with custom code.
  ]);
};
