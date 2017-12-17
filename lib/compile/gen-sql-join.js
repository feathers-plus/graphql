
const { EOL } = require('os');

const { indent, insertCustomCode } = require('feathers-plus-common/lib/code-generation');
const templates = require('./gen-sql-join-templates');

const EOLs = EOL + EOL;

let generatedMetadata;
let codeQuery;

module.exports = function genSqlJoin (parsed, generatedMetadata1) {
  generatedMetadata = generatedMetadata1;
  codeQuery = '';

  return genJoinsModule(parsed);
};

// ===== join-monster joins

function genJoinsModule (parsed) {
  return [
    '/* eslint no-unused-vars: 0 */',
    '',
    insertCustomCode('joins-imports'),
    '',
    'module.exports = function generatedSqlJoins(app, options) {',
    '  let { convertArgsToFeathers, convertArgsToOrderBy, convertArgsToWhere } = options;',
    '  let makeOrderBy = convertArgsToOrderBy(options);',
    '  let makeWhere = convertArgsToWhere(options);',
    indent(insertCustomCode('joins-header')),
    '',
    `  let sqlJoins = ${indent(genAllJoins(parsed), 2, false)}`,
    '',
    indent(insertCustomCode('joins-return')),
    '  return sqlJoins;',
    '};',
    insertCustomCode('joins-end'),
    ''
  ].join(EOL);
}

function genAllJoins (parsed) {
  let code = '';

  Object.keys(parsed).forEach(schemaName => {
    const parsedSchema = parsed[schemaName];

    // accumulate code for Query resolvers
    if (schemaName === 'Query') {
      codeQuery += (codeQuery ? EOLs : '') + genSchemaJoins(schemaName, parsedSchema);
    }

    // add code for schema joins
    if (schemaName !== 'Query' && schemaName !== 'Mutation') {
      code += (code ? EOLs : '') + [
        `${schemaName}: {`,
        `  // map the ${schemaName} schema to its SQL table`,
        // todo ?????????? what if sqltable or uniquekey not coded ??????????????????????????????????????????????????????
        `  sqlTable: '${generatedMetadata[schemaName].sqlTable}',`,
        `  uniqueKey: '${generatedMetadata[schemaName].sqlKey}',`,
        '  fields: {'
      ].join(EOL);

      const fieldCode = genSchemaJoins(schemaName, parsedSchema);
      if (fieldCode) {
        code += EOL + indent(fieldCode, 4);
      }

      code += EOL + [
        indent(insertCustomCode(`joins-${schemaName}-*fields`), 4),
        '  }',
        indent(insertCustomCode(`joins-${schemaName}`)),
        '},'
      ].join(EOL);
    }
  });

  // add code for Query resolvers
  if (codeQuery) {
    code += EOLs + [
      'Query: {',
      '  fields: {',
      indent(codeQuery, 4),
      indent(insertCustomCode('joins-query'), 4),
      '  },',
      '},'
    ].join(EOL);
  }

  return [
    '{',
    indent(code),
    '};'
  ].join(EOL);
}

function genSchemaJoins (schemaName, parsedSchema) {
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
            fieldCode += (fieldCode ? EOLs : '') + templateCode;
          }
          break;
        case 'sql':
          template = templates.sql;
          if (template) {
            const templateCode = template(schemaName, fieldName, parsedField, generatedMetadata);
            fieldCode += (fieldCode ? EOLs : '') + templateCode;
          }
          break;
      }
    });

    if (fieldCode) {
      code += (code ? EOL : '') + [
        `${fieldName}: {`,
        indent(fieldCode),
        indent(insertCustomCode(`joins-${schemaName}-${fieldName}`)),
        '},'
      ].join(EOL);
    }
  });

  return code;
}
