
const { join } = require('path');

const service = require('../../../../../lib'); // normally use: require('feathers-graphql')
const userSchema = require('./schemas');

module.exports = function compileSchemas() {
  const filePaths = {
    metadata: join(__dirname, 'generated-metadata.js'),
    serviceResolvers: join(__dirname, 'service-resolvers', 'generated-service-resolvers.js'),
    sqlJoins: join(__dirname, 'sql-joins', 'generated-sql-joins.js'),
    sqlResolvers: join(__dirname, 'sql-resolvers', 'generated-sql-resolvers.js'),
  };

  service.compile(userSchema, filePaths);
};
