
/*
 Intro to GraphQL: https://dev-blog.apollodata.com/the-basics-of-graphql-in-5-links-9e1dc4cac055
 Pagination info:
 http://join-monster.readthedocs.io/en/latest/pagination/
 https://stackoverflow.com/questions/42622912/in-graphql-whats-the-meaning-of-edges-and-node
 https://dev-blog.apollodata.com/explaining-graphql-connections-c48b7c3d6976
 https://dev-blog.apollodata.com/understanding-pagination-rest-graphql-and-relay-b10f835549e7
 */

const { EOL } = require('os');
const { insertCustomCode } = require('feathers-plus-common/lib/code-generation');

const templates = {
  'feathers-find': (...args) => templates['feathers-get'](...args, 'feathers.find'),
  'non-shareable': (...args) => templates.shareable(...args),
  'persisted': (...args) => templates.shareable(...args),

  'feathers-get': (schemaName, fieldName, parsedField, generatedMetadata, type = 'feathers.get') => { // eslint-disable-line
    const { type: { fieldType }, directives: { resolver: { sort, order } } } = parsedField;

    const keyHereColumnName = getConfigInfo(generatedMetadata, fieldType, 'sqlKey');
    const directiveSort = sort ? `{ ${sort}: ${order || '1'} }` : null;

    return [
      `// ${fieldType}, ${type}`,
      `orderBy(args, content) { return makeOrderBy(args, ${directiveSort}); },`,
      insertCustomCode(
        `sql-join-${schemaName}-${fieldName}`,
        `where(table, args) { return makeWhere(table, args, '${keyHereColumnName}'); },`
      )
    ].join(EOL);
  },

  sql: (schemaName, fieldName, parsedField, generatedMetadata) => { // eslint-disable-line
    const { directives: { sql } } = parsedField;

    return Object.keys(sql).reduce((code, key) => {
      const quote = key === 'sqlColumn' ? `'` : ''; // eslint-disable-line
      return code + (code ? `,${EOL}` : '') + `${key}: ${quote}${sql[key]}${quote}`;
    }, '');
  },

  'shareable': (schemaName, fieldName, parsedField, generatedMetadata) => { // eslint-disable-line
    const { type: { fieldType }, directives: { resolver: { keyHere, keyThere, sort, order, query } } } = parsedField;

    const directiveSort = sort ? `{ ${sort}: ${order || '1'} }` : null;

    const ourTableName = getConfigInfo(generatedMetadata, schemaName, 'sqlTable');
    const thereTableName = getConfigInfo(generatedMetadata, fieldType, 'sqlTable');
    const keyHereColumnName = getColumnName(generatedMetadata, schemaName, keyHere);
    const keyThereColumnName = getColumnName(generatedMetadata, fieldType, keyThere);

    return [
      `// Join ${ourTableName}.${keyHereColumnName} = ${thereTableName}.${keyThereColumnName}`,
      `sqlJoin(ourTable, otherTable) { return ourTable + '.${keyHereColumnName} = ' + otherTable + '.${keyThereColumnName}'; },`,
      `orderBy(args, content) { return makeOrderBy(args, ${directiveSort}); },`,
      // 'limit(...args) { console.log("limit", args; return undefined; }',
      // 'args: forwardConnectionArgs,',
      // 'sqlPaginate: true,',
      // 'limit: 1,',
      // 'offset:1,',
      insertCustomCode(
        `sql-join-${schemaName}-${fieldName}`, [
          `where(table, args) { return makeWhere(table, args, '${keyHereColumnName}', ${JSON.stringify(query)}); }, // eslint-disable-line`
        ])
    ].join(EOL);
  }
};

module.exports = templates;

function getConfigInfo (generatedMetadata, schemaName, propName) {
  if (!generatedMetadata[schemaName] ||
    !generatedMetadata[schemaName][propName]
  ) return null;

  return generatedMetadata[schemaName][propName];
}

function getColumnName (generatedMetadata, schemaName, fieldName) {
  if (!generatedMetadata[schemaName] ||
    !generatedMetadata[schemaName].fields ||
    !generatedMetadata[schemaName].fields[fieldName]
  ) return fieldName;

  return generatedMetadata[schemaName].fields[fieldName].sqlColumn;
}
