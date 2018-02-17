
const merge = require('lodash.merge');
const convertArgsToParams = require('./convert-args-to-params');
const resolversAst = require('graphql-resolvers-ast');

module.exports = function convertArgsToFeathers(extraAuthProps = []) {
  extraAuthProps = Array.isArray(extraAuthProps) ? extraAuthProps : [extraAuthProps];

  return (args, content, ast, moreParams = []) => {
    // GraphQL's `arg` is created with Object.create(null) https://github.com/graphql/express-graphql/issues/177
    // Neither args nor objects within args have Object's prototype.
    // `mergewith` conscientiously retains this, just as it retains ObjectID objects being instances of ObjectID.
    // However some DBs, e.g. NeDB, expect their object params to inherit from Object.
    // We therefore have to convert args so it and its inner objects inherit from Object.
    // The stringify/parse is safe enough as args is derived from the string params to a GraphQL's type.
    args = JSON.parse(JSON.stringify(args));

    moreParams = Array.isArray(moreParams) ? moreParams : [moreParams];

    const feathersParams = merge(
      {
        provider: content.provider,
        user: content.user,
        authenticated: content.authenticated,
        query: args.query || {},
        graphql: ast ? resolversAst(ast).resolverPath : true,
      },
      args.params || {},
      ...moreParams,
    );

    extraAuthProps.forEach(name => {
      if (name in content && !(name in feathersParams)) {
        feathersParams[name] = content[name];
      }
    });

    return convertArgsToParams(feathersParams);
  };
}





