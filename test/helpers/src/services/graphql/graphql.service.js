
// Initializes the `graphql` service on path `/graphql`
const createService = require('../../../../../lib'); // normally use: require('feathers-graphql')
const hooks = require('./graphql.hooks');

const schemas = require('./schemas');
const serviceResolvers = require('./service-resolvers');
const sqlResolvers = require('./sql-resolvers');
const sqlJoins = require('./sql-joins');
const metadata = require('./generated-metadata');

module.exports = function () {
  const app = this;

  const { usingSql, sql } = app.get('graphql');
  const { dialect, executeSql, openDb } = sql || {};

  const options = {
    schemas,
    metadata,
    resolvers: usingSql ? sqlResolvers : serviceResolvers,
    sqlJoins,
    dialect,
    executeSql,
    openDb: usingSql ? openDb : undefined,
    logSql: false,
  };

  // Initialize our service with any options it requires.
  const createdService = createService(options);
  app.use('/graphql', createdService);
  
  // Get our initialized service so that we can register hooks and filters
  const service = app.service('/graphql');
  
  service.hooks(hooks);
};
