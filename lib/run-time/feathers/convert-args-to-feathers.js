
const merge = require('lodash.mergewith');
const convertArgsToParams = require('./convert-args-to-params');

module.exports = function convertArgsToFeathers(args, moreParams = []) {
  moreParams = Array.isArray(moreParams) ? moreParams : [moreParams];

  const feathersParams = merge(
    { query: args.query || {} }, args.params || {}, { graphql: true }, ...moreParams, customizer // { query } must be defined.
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
