
const deepMerge = require('deepmerge');
const debug = require('debug')('gql-service-paths');

module.exports = function parseConfig (parsed) {
  let generatedConfig = {};
  let firstWarning = true;

  Object.keys(parsed).forEach(schemaName => {
    debug(`schemaName ${schemaName}`);
    const parsedSchema = parsed[schemaName];

    if (schemaName !== 'Query' && schemaName !== 'Mutation') {
      Object.keys(parsedSchema).forEach(fieldName => {
        const parsedField = parsedSchema[fieldName];
        const directives = parsedField.directives;

        Object.keys(directives || {}).forEach(directiveName => {
          switch (directiveName) {
            case 'feathers':
              generatedConfig[schemaName] = deepMerge(generatedConfig[schemaName] || {},
              parsedField.directives.feathers);
              break;
            case 'sql':
              generatedConfig[schemaName] = deepMerge(generatedConfig[schemaName] || {},
              { fields: { [fieldName]: parsedField.directives.sql } });
              break;
          }
        });
      });

      if (!generatedConfig[schemaName] || !generatedConfig[schemaName].service) {
        if (firstWarning) {
          /* eslint-disable */
          console.log('\n*** WARNING ***');
          console.log('GraphQL queries may be performed only against SQL databases');
          console.log('unless Feathers service paths are provided for all schemas.');
          /* eslint-enable */
          firstWarning = false;
        }

        console.log(`  ${schemaName} - no Feathers service path provided`); // eslint-disable-line
      }
    }
  });

  if (!firstWarning) console.log('*** WARNING ***\n'); // eslint-disable-line
  return generatedConfig;
};
