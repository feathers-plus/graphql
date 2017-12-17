
const { EOL } = require('os');

const { indent, insertCustomCode } = require('feathers-plus-common/lib/code-generation');
const templates = require('./gen-service-resolver-templates');

const EOLs = EOL + EOL;

let generatedMetadata;
let dataLoaderNamesMade;
let codeQuery;

// todo Need to implement a sqlDeps for services

module.exports = function genResolversCode (parsed, generatedMetadata1) {
  generatedMetadata = generatedMetadata1;
  dataLoaderNamesMade = {};
  codeQuery = '';

  return genResolverModule(parsed);
};

// ===== Resolvers

function genResolverModule (parsed) {
  return [
    '/* eslint no-unused-vars: 0 */',
    '',
    'const deepMerge = require(\'deepmerge\'); // eslint-disable-line',
    `const debug = require('debug')('feathers:io');`, // eslint-disable-line
    insertCustomCode('resolvers-imports'),
    '',
    'module.exports = function generatedServiceResolvers(app, options) {',
    '  let { convertArgsToParams, convertArgsToFeathers, extractAllItems, extractFirstItem, // eslint-disable-line',
    '    feathersDataLoader: { feathersDataLoader } } = options; ',
    indent(insertCustomCode('resolvers-header')),
    '',
    `  let resolvers = ${indent(genAllResolvers(parsed), 2, false)}`,
    '',
    indent(insertCustomCode('resolvers-return')),
    '  return resolvers;',
    '};',
    insertCustomCode('resolvers-end'),
    ''
  ].join(EOL);
}

function genAllResolvers (parsed) {
  let code = '';

  Object.keys(parsed).forEach(schemaName => {
    const parsedSchema = parsed[schemaName];

    // accumulate code for Query resolvers
    if (schemaName === 'Query') {
      codeQuery = genSchemaResolvers(schemaName, parsedSchema, codeQuery);
    }

    // add code for schema resolvers
    if (schemaName !== 'Query' && schemaName !== 'Mutation') {
      code += (code ? EOLs : '') + [
        `${schemaName}: {`,
        indent(genSchemaResolvers(schemaName, parsedSchema, '')),
        indent(insertCustomCode(`resolvers-${schemaName}`)),
        '},'
      ].join(EOL);
    }
  });

  const sharedNames = Object.keys(dataLoaderNamesMade).filter(
    name => name.charAt(0) !== '_' && dataLoaderNamesMade[name].length > 1
  );

  if (sharedNames.length) {
    code += EOLs + [
      '/*',
      ' Shareable DataLoaders shared by more than one resolver',
      sharedNames.map(name => [
        `   ${name}`,
        indent(dataLoaderNamesMade[name].join(EOL), 5)
      ].join(EOL)),
      '*/'
    ].join(EOL);
  }

  const persistedNames = Object.keys(dataLoaderNamesMade).filter(
    name => name.charAt(0) === '_' && dataLoaderNamesMade[name].length > 1
  );

  if (persistedNames.length) {
    code += EOLs + [
      '/*',
      ' Persisted DataLoaders shared by more than one resolver',
      persistedNames.map(name => [
        `   ${name}`,
        indent(dataLoaderNamesMade[name].join(EOL), 5)
      ].join(EOL)),
      '*/'
    ].join(EOL);
  }

  // add code for Query resolvers
  if (codeQuery) {
    code += EOLs + [
      'Query: {',
      indent(codeQuery),
      indent(insertCustomCode('resolvers-query')),
      '},'
    ].join(EOL);
  }

  return [
    '{',
    indent(code),
    '};'
  ].join(EOL);
}

function genSchemaResolvers (schemaName, parsedSchema, code) {
  Object.keys(parsedSchema).forEach(fieldName => {
    const parsedField = parsedSchema[fieldName];
    const directives = parsedField.directives;

    Object.keys(directives || {}).forEach(directiveName => {
      if (directiveName === 'resolver') {
        const template = templates[directives.resolver.template];
        if (template) {
          const { dataLoaderName, templateCode } = template(schemaName, fieldName, parsedField, generatedMetadata);

          if (dataLoaderName) {
            const lines = templateCode.split('\n');

            if (!(dataLoaderName in dataLoaderNamesMade)) {
              dataLoaderNamesMade[dataLoaderName] = [];
            }

            dataLoaderNamesMade[dataLoaderName].push(lines[0].trim());
          }

          code += (code ? EOLs : '') + templateCode;
        }
      }
    });
  });

  return code;
}
