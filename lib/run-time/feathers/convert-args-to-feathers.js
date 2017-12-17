
const deepMerge = require('deepmerge');
const convertArgsToParams = require('./convert-args-to-params');

module.exports = function convertArgsToFeathers(args, moreParams = []) {
  moreParams = Array.isArray(moreParams) ? moreParams : [moreParams];

  return convertArgsToParams(deepMerge.all(
    [ { query: args.query || {} }, args.params || {}, { graphql: true }].concat(moreParams) // { query } must be defined.
  ));
};
