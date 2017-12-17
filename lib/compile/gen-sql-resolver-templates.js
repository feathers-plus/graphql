
const { EOL } = require('os');

const { indent, insertCustomCode } = require('feathers-plus-common/lib/code-generation');

const templates = {
  'feathers-find': (...args) => templates['feathers-get'](...args, 'feathers.find'),

  'returns': (schemaName, fieldName, parsedField, generatedMetadata) => { // eslint-disable-line
    const { type: { fragment }, directives: { resolver: { result, sql } } } = parsedField;

    if (sql === false) return '';

    return [
      `// ${fragment}`,
      `${fieldName}(parent, args, content, info) {`,
      indent(insertCustomCode(
        `sql-resolvers-${schemaName}-${fieldName}`,
        `return ${result};`
      )),
      '},'
    ].join(EOL);
  },

  'feathers-get': (schemaName, fieldName, parsedField, generatedMetadata) => { // eslint-disable-line
    const { type: { fragment } } = parsedField;

    return [
      `// ${fragment}`,
      insertCustomCode(
        `sql-resolvers-${schemaName}-${fieldName}`,
        `${fieldName}: sqlResolver,`
      )
    ].join(EOL);
  }
};

module.exports = templates;
