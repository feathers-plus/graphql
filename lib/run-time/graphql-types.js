
const GraphQLJSON = require('graphql-type-json');

module.exports = {
  resolverTypes: {
    JSON: GraphQLJSON
  },

  schemaTypes: `
    scalar JSON
  `
};
