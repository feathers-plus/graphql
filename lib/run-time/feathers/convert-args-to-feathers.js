
const merge = require('lodash.mergewith');
const convertArgsToParams = require('./convert-args-to-params');
const resolversAst = require('graphql-resolvers-ast');

module.exports = function convertArgsToFeathers(args, ast, moreParams = []) {
  // GraphQL's `arg` is created with Object.create(null) https://github.com/graphql/express-graphql/issues/177
  // Neither args nor objects within args have Object's prototype.
  // `mergewith` conscientiously retains this, just as it retains ObjectID objects being instances of ObjectID.
  // However some DBs, e.g. NeDB, expect their object params to inherit from Object.
  // We therefore have to convert args so it and its inner objects inherit from Object.
  // The stringify/parse is safe enough as args is derived from the string params to a GraphQL's type.
  args = JSON.parse(JSON.stringify(args));

  moreParams = Array.isArray(moreParams) ? moreParams : [moreParams];

  const feathersParams = merge(
    { graphql: ast ? resolversAst(ast) : true },
    { query: args.query || {} }, // { query } must be defined.
    args.params || {},
    ...moreParams,
    customizer
  )
  return convertArgsToParams(feathersParams);
};

function customizer(objValue, srcValue, key, obj, src, stack) {
  return undefined; // Comment out to enable customization function.

  if (typeof srcValue === 'object') {
    if (srcValue instanceof ObjectID) {
      return new ObjectID(srcValue.id);}
  }

  return undefined;
}
