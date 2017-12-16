
const deepMerge = require('deepmerge');
const generatedSqlResolvers = require('./generated-sql-resolvers');

module.exports = function (app, options) {
  const sqlResolvers = [
    generatedSqlResolvers(app, options),
    {}, // Replace with any custom sql-resolver imports.
  ];
  
  return deepMerge.all(sqlResolvers);
};
