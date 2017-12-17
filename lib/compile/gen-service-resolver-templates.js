
const { EOL } = require('os');

const { indent, insertCustomCode, onlyStrings } = require('feathers-plus-common/lib/code-generation');
const { hashObject } = require('feathers-plus-common');

/*
 DataLoader names.
 The easiest method is to find your DataLoader in the generated resolvers module.

 DataLoaders can be accessed within GraphQL resolvers using content.dataLoaders.shareable
 and .nonShareable. The 'nonSharable' DataLoader caches cannot be shared between requests.

 The 'shareable' DataLoaders are for `@resolver(template: "shareable", ...`
 Their caches can be shared between requests if you clear a record's cache entry when its mutated.
 This can be done in an after hook.

 You however need a particular DataLoader's name to access it.
 The following examples explain how shareable DataLoader names are formed.

 (a) 'user_uuid' -- User + keyThere
   type Comment {
     author: User! @resolver(template: "shareable", keyHere: "authorUuid", keyThere: "uuid")
 or  author: User  @resolver(template: "shareable", keyHere: "authorUuid", keyThere: "uuid")

 (b)'like_commentUuid_list' -- Like + keyThere + 'list' as many records are joined
   type Comment {
     likes: [Like!]     @resolver(template: "shareable", keyHere: "uuid", keyThere: "commentUuid")
 or  likes: [Like!]!    @resolver(template: "shareable", keyHere: "uuid", keyThere: "commentUuid")
 or  likes: [Like]!     @resolver(template: "shareable", keyHere: "uuid", keyThere: "commentUuid")

 (c) 'like_authorUuid_list_$sort_uuid' -- add $sort plus sort if ascending order
   type User {
     likes: [Like!]     @resolver(template: "shareable", keyHere: "uuid", keyThere: "authorUuid", sort: "uuid")

 (d) 'relationship_followeeUuid_list_$sort_uuid_DESC' -- add DESC if descending order
     type User {
       followed_by: [Relationship!] @resolver(template: "shareable", keyHere: "uuid", keyThere: "followeeUuid", sort: "uuid", order: -1)

 (e) 'like_authorUuid_list_$sort_uuid_$hash_344c7ec8' -- add $hash and a predictable short hash of query and params
     type User {
       likes: [Like!]   @resolver(template: "shareable", keyHere: "uuid", keyThere: "authorUuid", sort: "uuid", params: "{test1:true}")

 (f) The names of persisted DataLoaders start with  '_'.

 For completeness sake, this is how non-shareable DataLoader names are formed.

 (g) 'User_post_authorUuid_list_$sort_uuid' -- starts with User
     type User {
       posts(query: JSON, params: JSON): [Post!]  @resolver(template: "non-shareable", keyHere: "uuid", keyThere: "authorUuid", sort: "uuid")
 */

const defaultMaxCacheItems = 100;

const templates = {
  'returns': (schemaName, fieldName, parsedField, generatedMetadata) => { // eslint-disable-line
    const { type: { fragment }, directives: { resolver: { result } } } = parsedField;

    return { templateCode: [
      `// ${fragment}`,
      `${fieldName}(parent, args, content, info) {`,
      indent(insertCustomCode(
        `resolvers-${schemaName}-${fieldName}-result`,
        `return ${result};`
      )),
      '},'
    ].join(EOL)};
  },

  'feathers-get': (schemaName, fieldName, parsedField, generatedMetadata) => { // eslint-disable-line
    const { type: { fragment }, directives: { resolver: { schema } } } = parsedField;
    const serviceName = generatedMetadata[schema].service;

    // Note that syntax errors result if 'args' contains references to 'parent', etc.
    return { templateCode: [
      `// ${fragment}`,
      `${fieldName}(parent, args, content, info) {`,
      makeDefaultFeathersParams(parsedField),
      indent(insertCustomCode(`resolvers-${schemaName}-${fieldName}-params`)),
      `  let result = options.services.${serviceName}.get(args.key, feathersParams).then(extractFirstItem);`,
      indent(insertCustomCode(`resolvers-${schemaName}-${fieldName}-result`)),
      '  return result;',
      '},'
    ].join(EOL)};
  },

  'feathers-find': (schemaName, fieldName, parsedField, generatedMetadata) => { // eslint-disable-line
    const { type: { fragment }, directives: { resolver: { schema } } } = parsedField;
    const serviceName = generatedMetadata[schema].service;

    // Note that syntax errors result if 'args' contains references to 'parent', etc.
    return { templateCode: [
      `// ${fragment}`,
      `${fieldName}(parent, args, content, info) {`,
      makeDefaultFeathersParams(parsedField),
      indent(insertCustomCode(`resolvers-${schemaName}-${fieldName}-params`)),
      `  let result = options.services.${serviceName}.find(feathersParams).then(extractAllItems);`,
      indent(insertCustomCode(`resolvers-${schemaName}-${fieldName}-result`)),
      '  return result;',
      '},'
    ].join(EOL)};
  },

  'shareable': (schemaName, fieldName, parsedField, generatedMetadata) => { // eslint-disable-line
    const { whereDesc, sortedByDesc, resolverDesc, dataLoaderDesc } = makeParts(schemaName, fieldName, 'shareable', parsedField);
    const { type: { fieldType, cardinality }, directives: { resolver: { keyHere, keyThere } } } = parsedField;

    const dataLoaderName = makeDataLoaderName(schemaName, fieldName, parsedField, 'shareable');
    const serviceName = generatedMetadata[fieldType].service;

    return {
      dataLoaderName,
      templateCode: [
        `// ${resolverDesc}, where ${whereDesc}`,
        `// ${dataLoaderDesc}${sortedByDesc}`,
        `${fieldName}({ ${keyHere} }, args, content, info) {`,
        `  let dataLoaderName = '${dataLoaderName}';`,
        '  let shareable = content.dataLoaders.shareable;',
        indent(insertCustomCode(`resolvers-${schemaName}-${fieldName}-header`)),
        `  if (shareable[dataLoaderName]) return shareable[dataLoaderName].load(${keyHere});`,
        '',
        makeDefaultFeathersParams(parsedField),
        indent(insertCustomCode(`resolvers-${schemaName}-${fieldName}-params`)),
        '',
        `  shareable[dataLoaderName] = feathersDataLoader(dataLoaderName, '${cardinality}', '${keyThere}',`,
        '    keys => {',
        `      feathersParams.query.${keyThere} = { $in: keys };`,
        `      debug('Execute ${serviceName}.find(', feathersParams, ');');`,
        indent(insertCustomCode(`resolvers-${schemaName}-${fieldName}-keys-return`), 6),
        `      return options.services.${serviceName}.find(feathersParams);`,
        '    }',
        '  );',
        '',
        indent(insertCustomCode(`resolvers-${schemaName}-${fieldName}-result`)),
        `  return shareable[dataLoaderName].load(${keyHere});`,
        '},'
      ].join(EOL)
    };
  },

  'persisted': (schemaName, fieldName, parsedField, generatedMetadata) => { // eslint-disable-line
    const { whereDesc, sortedByDesc, resolverDesc, dataLoaderDesc } = makeParts(schemaName, fieldName, 'persisted', parsedField);
    const { type: { fieldType, cardinality }, directives: { resolver: { keyHere, keyThere, max } } } = parsedField;

    const dataLoaderName = makeDataLoaderName(schemaName, fieldName, parsedField, 'persisted');
    const serviceName = generatedMetadata[fieldType].service;

    return {
      dataLoaderName,
      templateCode: [
        `// ${resolverDesc}, where ${whereDesc}`,
        `// ${dataLoaderDesc}${sortedByDesc}`,
        `${fieldName}({ ${keyHere} }, args, content, info) {`,
        `  let dataLoaderName = '${dataLoaderName}';`,
        '  let persisted = content.dataLoaders.persisted;',
        indent(insertCustomCode(`resolvers-${schemaName}-${fieldName}-header`)),
        `  if (persisted[dataLoaderName]) return persisted[dataLoaderName].load(${keyHere});`,
        '',
        makeDefaultFeathersParams(parsedField),
        indent(insertCustomCode(`resolvers-${schemaName}-${fieldName}-params`)),
        '',
        `  persisted[dataLoaderName] = feathersDataLoader(dataLoaderName, '${cardinality}', '${keyThere}',`,
        '    keys => {',
        `      feathersParams.query.${keyThere} = { $in: keys };`,
        `      debug('Execute ${serviceName}.find(', feathersParams, ');');`,
        indent(insertCustomCode(`resolvers-${schemaName}-${fieldName}-keys-return`), 6),
        `      return options.services.${serviceName}.find(feathersParams);`,
        '    },',
        `    ${max || defaultMaxCacheItems}`,
        '  );',
        '',
        indent(insertCustomCode(`resolvers-${schemaName}-${fieldName}-result`)),
        `  return persisted[dataLoaderName].load(${keyHere});`,
        '},'
      ].join(EOL)
    };
  },

  'non-shareable': (schemaName, fieldName, parsedField, generatedMetadata) => { // eslint-disable-line
    const { whereDesc, sortedByDesc, resolverDesc, dataLoaderDesc } = makeParts(schemaName, fieldName, 'non-shareable', parsedField);
    const { type: { fieldType, cardinality }, directives: { resolver: { keyHere, keyThere } } } = parsedField;

    const dataLoaderName = makeDataLoaderName(schemaName, fieldName, parsedField, 'non-shareable');
    const serviceName = generatedMetadata[fieldType].service;

    return {
      dataLoaderName,
      templateCode: [
        `// ${resolverDesc}, where ${whereDesc}`,
        `// ${dataLoaderDesc}${sortedByDesc}`,
        `${fieldName}({ ${keyHere} }, args, content, info) {`,
        `  let dataLoaderName = '${dataLoaderName}';`,
        '  let nonShareable = content.dataLoaders.nonShareable;',
        indent(insertCustomCode(`resolvers-${schemaName}-${fieldName}-header`)),
        `  if (nonShareable[dataLoaderName]) return nonShareable[dataLoaderName].load(${keyHere});`,
        '',
        makeDefaultFeathersParams(parsedField),
        indent(insertCustomCode(`resolvers-${schemaName}-${fieldName}-params`)),
        '',
        `  nonShareable[dataLoaderName] = feathersDataLoader(dataLoaderName, '${cardinality}', '${keyThere}',`,
        '    keys => {',
        `      feathersParams.query.${keyThere} = { $in: keys };`,
        `      debug('Execute ${serviceName}.find(', feathersParams, ');');`,
        indent(insertCustomCode(`resolvers-${schemaName}-${fieldName}-keys-return`), 6),
        `      return options.services.${serviceName}.find(feathersParams);`,
        '    }',
        '  );',
        '',
        indent(insertCustomCode(`resolvers-${schemaName}-${fieldName}-result`)),
        `  return nonShareable[dataLoaderName].load(${keyHere});`,
        '},'
      ].join(EOL)
    };
  }
};

module.exports = templates;

function makeParts (schemaName, fieldName, dataLoaderType, parsedField) { // eslint-disable-line
  const {
    type: { fragment, fieldType, cardinality },
    directives: { resolver: { keyHere, keyThere, sort, order } }
  } = parsedField;

  const isList = cardinality && cardinality.charAt(0) === '[';
  const fieldWithCardinality = `${isList ? '[' : ''}${fieldType}.${keyThere}${isList ? ']' : ''}`;
  // 'order' will be a string even if schema's @resolver has 'order: 1'.
  const sortedByDesc = sort ? `, sorted by ${sort} ${order && order !== '1' ? 'DESC' : ''}` : '';

  return {
    isList,
    fieldWithCardinality,
    whereDesc: `${schemaName}.${keyHere}: ${fieldWithCardinality}`,
    sortedByDesc,
    resolverDesc: `${fragment}`,
    dataLoaderDesc: `${schemaName}.${keyHere} ==> ${dataLoaderType} DataLoader key ==> ${fieldWithCardinality}`,
    query: [
      `${keyThere}: { $in: keys }`,
      sort ? `, $sort: { ${sort}: ${order || '1'} }` : ''
    ].join('')
  };
}

function makeDefaultFeathersParams (parsedField) {
  const { directives: { resolver: { sort, order, query, params } } } = parsedField;

  if (!sort && !query && !params) return '  let feathersParams = convertArgsToFeathers(args);';

  return onlyStrings([
    '  let feathersParams = convertArgsToFeathers(args, [',
    sort ? `    { query : { $sort: { ${sort}: ${order || '1'} } } },` : undefined,
    query ? `    { query: ${JSON.stringify(query)} }, // eslint-disable-line` : undefined,
    params ? `    ${JSON.stringify(params)}, // eslint-disable-line` : undefined,
    '  ]);'
  ]).join(EOL);
}

function makeDataLoaderName (schemaName, fieldName, parsedField, dlType) { // eslint-disable-line
  const { type: { fieldType, cardinality }, hasArguments, directives: { resolver: { keyThere, sort, order, query, params } } } = parsedField;

  return [
    dlType === 'persisted' ? '_' : '',
    hasArguments ? `${schemaName}_` : '',
    `${fieldType.toLowerCase()}_${keyThere}`,
    cardinality && cardinality.charAt(0) === '[' ? '_list' : '',
    sort ? `_$sort_${sort}` : '',
    order && order !== '1' ? '_DESC' : '',
    (query || params) ? `_$hash_${hashObject({ query, params })}` : ''
  ].join('');
}
