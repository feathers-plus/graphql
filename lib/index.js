'use strict';

const mergeSqlMetadata = require('join-monster-graphql-tools-adapter');
const { makeExecutableSchema } = require('graphql-tools');
const { graphql } = require('graphql');
const { BadRequest } = require('@feathersjs/errors');

const runTime = require('./run-time');

// Create the service.
class Service {
  constructor (options = {}) {
    this._options = Object.assign({}, options, runTime); // Define options & convenience methods.
    this.sqlDb = undefined;

    const props = this._options.extraAuthProps || [];
    this._extraAuthProps = Array.isArray(props) ? props : [props];
  }

  setup (app) {
    this._app = app;

    // Compile the GraphQL definition.
    this._schema = makeExecutableSchema({
      // Add custom GraphQL scalar types
      typeDefs: runTime.schemaTypes + this._options.schemas,
      resolvers: Object.assign({},
        runTime.resolverTypes,
        this._options.resolvers(this._app, this._options)
      )
    });

    // Merge SQL metadata into the GraphQL definition.
    const sqlJoins = this._options.sqlJoins;

    if (sqlJoins) {
      mergeSqlMetadata(this._schema, sqlJoins(this._app, this._options));
    }

    // Open SQL database
    if (this._options.openDb) {
      this.sqlDb = this._options.openDb();
    }
  }

  find (params) {
    if (!params.query || !params.query.query || typeof params.query.query !== 'string') {
      throw new BadRequest('A GraphQL query requires a "params.query.query" property. (@feathers-plus/graphql)');
    }

    const content = {
      app: this._app,
      batchLoaders: {}, // where batchloaders are stored for this request
      provider: params.provider,
      user: params.user,
      authenticated: params.authenticated,
    }

    const props = this._options.extraAuthProps || [];

    (Array.isArray(props) ? props : [props]).forEach(name => {
      if (name in params && !(name in content)) {
        content[name] = params[name];
      }
    });

    // Execute GraphQL request.
    /*
     http://graphql.org/graphql-js/graphql/
     graphql(schema, query, rootValue, contextValue, variableValues, operationName);
      rootValue: will get passed as the root value to the executor. 'parent' in first resolver.
      contextValue: will get passed to all resolve functions
      variableValues: will get passed to the executor to provide values for any variables in 'query'
      operationName: allows the caller to specify which operation in requestString will be run,
      in cases where requestString contains multiple top-level operations.
     */
    return graphql(this._schema, params.query.query, {}, content)
    // GraphQL throws on initialization errors. It swallows others errors.
      .catch(err => {
        throw new BadRequest(err.message, { stack: err.stack });
      })
      .then(response => {
        if (!response.errors) {
          return !content.pagination ? response.data :
            Object.assign({}, content.pagination, { data: response.data });
        }

        // Reformat GraphQL error for Feathers.
        const errors = response.errors.map(({ locations = [], message = '', path }) => ({
          message,
          line: locations.length ? locations[0].line : undefined,
          column: locations.length ? locations[0].column : undefined,
          path: (path || []).reduce((path, elem, i) => `${path}${i ? ':' : ''}${elem}`, '')
        }));

        throw new BadRequest('GraphQL processing error. (@feathers-plus/graphql)', {
          errors,
          data: response.data // Return what GraphQL data is available. Likely contains 'null's.
        });
      });
  }
}

function moduleExports (options) {
  return new Service(options);
}

Object.assign(moduleExports, Service, runTime); // Attach props for convenience.

module.exports = moduleExports;
module.exports.default = moduleExports;
