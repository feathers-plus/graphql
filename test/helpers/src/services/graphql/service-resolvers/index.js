
const deepMerge = require('deepmerge');
const generatedServiceResolvers = require('./generated-service-resolvers');

module.exports = function (app, options) {
  const serviceResolvers = [
    generatedServiceResolvers(app, options),
    {}, // Replace with any custom service-resolver imports.
  ];
  
  return deepMerge.all(serviceResolvers);
};
