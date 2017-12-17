
const genServiceResolvers = require('./gen-service-resolvers');
const genSqlJoin = require('./gen-sql-join');
const genSqlResolvers = require('./gen-sql-resolvers');
const parseMetadata = require('./parse-metadata');
const genMetadata = require('./gen-metadata');
const parseAst = require('./parse-ast');

module.exports = function genGraphqlCode (userSchema) {
  const parsed = parseAst(userSchema);
  const generatedMetadata = parseMetadata(parsed);

  return {
    metadata: genMetadata(parsed, generatedMetadata),
    serviceResolvers: genServiceResolvers(parsed, generatedMetadata),
    sqlJoins: genSqlJoin(parsed, generatedMetadata),
    sqlResolvers: genSqlResolvers(parsed, generatedMetadata)
  };
};
