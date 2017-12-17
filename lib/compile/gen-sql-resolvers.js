
const { EOL } = require('os');

const { indent, insertCustomCode, onlyStrings } = require('feathers-plus-common/lib/code-generation');
const templates = require('./gen-sql-resolver-templates');

const EOLs = EOL + EOL;

let generatedMetadata;
let codeQuery;

module.exports = function genSqlResolvers (parsed, generatedMetadata1) {
  generatedMetadata = generatedMetadata1;
  codeQuery = '';

  return genResolverModule(parsed);
};

// ===== sql resolvers

function genResolverModule (parsed) {
  return [
    '/* eslint no-unused-vars: 0 */',
    '',
    insertCustomCode('sql-resolvers-imports'),
    '',
    'module.exports = function generatedSqlResolvers(app, options) {',
    '  let { dialect, executeSql, genAndRunSql } = options;',
    '  let genRunSql = genAndRunSql(executeSql, { dialect }, options);',
    '  let sqlResolver = (parent, args, content, info) => genRunSql(content, info);',
    indent(insertCustomCode('sql-resolvers-header')),
    '',
    `  let sqlResolvers = ${indent(genAllResolvers(parsed), 2, false)}`,
    '',
    indent(insertCustomCode('sql-resolvers-return')),
    '  return sqlResolvers;',
    '};',
    insertCustomCode('sql-resolvers-end'),
    ''
  ].join(EOL);
}

function genAllResolvers (parsed) {
  let code = '';

  Object.keys(parsed).forEach(schemaName => {
    const parsedSchema = parsed[schemaName];

    // accumulate code for Query resolvers
    if (schemaName === 'Query') {
      codeQuery += (codeQuery ? EOLs : '') + genSchemaResolvers(schemaName, parsedSchema);
    }

    // add code for schema sql-resolvers
    if (schemaName !== 'Query' && schemaName !== 'Mutation') {
      code += (code ? EOLs : '') + onlyStrings([
        `${schemaName}: {`,
        indent(genSchemaResolvers(schemaName, parsedSchema) || undefined),
        indent(insertCustomCode(`sql-resolvers-${schemaName}`)),
        '},'
      ]).join(EOL);
    }
  });

  // add code for Query resolvers
  if (codeQuery) {
    code += EOLs + [
      'Query: {',
      indent(codeQuery),
      indent(insertCustomCode('sql-resolvers-Query')),
      '},'
    ].join(EOL);
  }

  return [
    '{',
    indent(code),
    '};'
  ].join(EOL);
}

function genSchemaResolvers (schemaName, parsedSchema) {
  let code = '';

  Object.keys(parsedSchema).forEach(fieldName => {
    const parsedField = parsedSchema[fieldName];
    const directives = parsedField.directives;
    let fieldCode = '';
    let template;

    Object.keys(directives || {}).forEach(directiveName => {
      switch (directiveName) {
        case 'resolver':
          template = templates[directives.resolver.template];
          if (template) {
            const templateCode = template(schemaName, fieldName, parsedField, generatedMetadata);
            if (templateCode) {
              fieldCode += (fieldCode ? EOLs : '') + templateCode + EOL;
            }
          }
          break;
      }
    });

    if (fieldCode) {
      code += (code ? EOL : '') + fieldCode;
    }
  });

  return code;
}
