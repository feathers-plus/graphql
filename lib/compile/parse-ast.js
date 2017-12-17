
const { parse } = require('graphql');
const { contains } = require('feathers-plus-common');
const debug = require('debug')('gql-parse');

const directiveArgumentNames = {
  feathers: {
    path: 'string',
    service: 'string',
    key: 'string',
    sqlTable: 'string',
    sqlKey: 'string'
  },
  resolver: {
    keyHere: 'string',
    keyThere: 'string',
    order: 'number',
    params: 'object',
    query: 'object',
    schema: 'string',
    sort: 'string',
    result: 'string',
    template: 'string',
    sql: 'boolean',
    max: 'number'
  },
  sql: {
    sqlBatch: 'string',
    sqlColumn: 'string',
    sqlDeps: 'string',
    sqlExpr: 'string',
    sqlJoin: 'string',
    where: 'string'

  }
};

const builtinScalarTypes = [
  'Int', 'Int!', 'Float', 'Float!', 'String', 'String!', 'Boolean', 'Boolean!', 'ID', 'ID!'
];

let scalarTypes;

module.exports = function parseAst (userSchema) {
  scalarTypes = builtinScalarTypes; // scalarTypes is not currently used during generation

  const ast = parse(userSchema);
  const parsed = {};

  if (ast.kind !== 'Document') throw new Error('Expected root.kind to be "Document".');

  ast.definitions.forEach(defn => {
    if (defn.kind === 'ScalarTypeDefinition') return scalarTypes.push(defn.name.value);
    if (defn.kind !== 'ObjectTypeDefinition') return;

    const defnName = defn.name.value;
    const parsedDefn = parsed[defnName] = {};

    defn.fields.forEach((field, i) => {
      if (field.kind !== 'FieldDefinition') throw new Error(`Expected kind FieldDefinition not ${i} ${field.kind}`);
      const fieldName = field.name.value;
      const parsedField = parsedDefn[fieldName] = {};

      parsedField.hasArguments = !!field.arguments.length;

      if (field.type) {
        parsedField.type = getType(userSchema, field);
      }

      field.directives.forEach((directive, i) => {
        if (directive.kind !== 'Directive') throw new Error(`Expected Directive not ${i} ${directive.kind}`);

        const directiveName = directive.name.value;
        const args = {};

        directive.arguments.forEach((argument, i) => {
          if (argument.kind !== 'Argument') throw new Error(`Expected Argument not ${i} ${argument.kind}`);
          const name = argument.name.value;
          let value;

          if (!(directiveName in directiveArgumentNames)) {
            args[name] = argument.value.value;
            return args[name];
          }

          const nameTypeof = directiveArgumentNames[directiveName][name];
          if (!nameTypeof) throw new Error(`Unexpected argument name for ${defnName} ${fieldName} ${directiveName} ${name}`);

          debug('convert arg', defnName, fieldName, directiveName, name, nameTypeof, argument.value.value);

          if (nameTypeof === 'string') {
            value = argument.value.value;
          } else {
            try {
              value = Function('return ' + argument.value.value)(); // eslint-disable-line
            } catch (err) {
              throw new Error(`Expected non-string value for ${defnName} ${fieldName} ${directiveName} ${name}`);
            }
          }

          if (typeof value !== nameTypeof) throw new Error(`Argument name ${defnName} ${fieldName} ${directiveName} ${name} must be ${nameTypeof}`); // eslint-disable-line

          args[name] = value;
        });

        if (!parsedField.directives) parsedField.directives = {};

        if (Object.keys(args).length === 0) {
          parsedField.directives[directive.name.value] = null;
        } else {
          parsedField.directives[directive.name.value] = args;
        }
      });
    });
  });

  return parsed;
};

function getType (userSchema, field) {
  const type = field.type;
  const types = [];
  gatherTypes(type);

  let fragment = userSchema.substring(field.loc.start, field.loc.end);
  const i = fragment.indexOf('@');
  fragment = (i !== -1 ? fragment.substr(0, i) : fragment).trim();

  const fieldType = types[types.length - 1];
  const scalar = contains(scalarTypes, fieldType);
  let cardinality = '';

  for (let i = 0, len = types.length - 1; i < len; i++) {
    const next = types[types.length - 2 - i];
    if (next === 'NonNullType') {
      cardinality += '!';
    }
    if (next === 'ListType') {
      cardinality = `[${cardinality}]`;
    }
  }

  return { fragment, scalar, fieldType, cardinality };

  function gatherTypes (type) {
    if (type.kind === 'NamedType') {
      types.push(type.name.value);
      return;
    }

    types.push(type.kind);
    if (type.type) gatherTypes(type.type);
  }
}
