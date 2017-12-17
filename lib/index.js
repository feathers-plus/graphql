'use strict';

const mergeSqlMetadata = require('join-monster-graphql-tools-adapter');
const { extractAllItems, extractFirstItem } = require('feathers-plus-common');
const { makeExecutableSchema } = require('graphql-tools');
const { BadRequest } = require('feathers-errors');
const { graphql } = require('graphql');

const runTime = require('./run-time');

// Create the service.
class Service {
  constructor (options = {}) {
    this._options = Object.assign({}, options, runTime, { extractAllItems, extractFirstItem }); // Define options & convenience methods.
    this.persistedDataLoaders = {}; // Define persisted DataLoaders.
    this.sqlDb = undefined;
  }

  setup (app) {
    this._app = app;

    // Open SQL database
    if (this._options.openDb) {
      this.sqlDb = this._options.openDb();
    }

    // Define Feathers services used.
    const metadata = this._options.metadata = this._options.metadata || {};
    const services = this._options.services = {};

    Object.keys(metadata).forEach(schema => {
      services[metadata[schema].service] = this._app.service(metadata[schema].path);
    });

    // Compile the GraphQL definition.
    this._schema = makeExecutableSchema({
      // Add custom GraphQL scalar types to definitions, e.g. JSON.
      typeDefs: runTime.schemaTypes + this._options.schemas,
      resolvers: Object.assign({}, runTime.resolverTypes, this._options.resolvers(this._app, this._options))
    });

    // Merge SQL metadata into the GraphQL definition.
    const sqlJoins = this._options.sqlJoins;

    if (sqlJoins) {
      mergeSqlMetadata(this._schema, sqlJoins(this._app, this._options));
    }
  }

  find (params) {
    if (!params.query || !params.query.graphql || typeof params.query.graphql !== 'string') {
      throw new BadRequest('No GraphQL query provided. (feathers-graphql)');
    }

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
    return graphql(this._schema, params.query.graphql, {}, {
      app: this._app,
      batchLoaders: {},
      dataLoaders: {
        shareable: {},
        nonShareable: {},
        persisted: this.persistedDataLoaders
      }
    })
    // GraphQL throws on initialization errors. It swallows others errors.
      .catch(err => {
        throw new BadRequest(err.message, { stack: err.stack });
      })
      .then(response => {
        if (!response.errors) return response.data;

        // Reformat GraphQL error for Feathers.
        const errors = response.errors.map(({ locations = [], message = '', path }) => ({
          message,
          line: locations.length ? locations[0].line : undefined,
          column: locations.length ? locations[0].column : undefined,
          path: (path || []).reduce((path, elem, i) => `${path}${i ? ':' : ''}${elem}`, '')
        }));

        throw new BadRequest('GraphQL processing error.', {
          errors,
          data: response.data // Return what GraphQL data is available. Likely contains 'null's.
        });
      })
      // todo Remove.
      .catch(err => {
        /* eslint-disable */
        console.log('\n==========');
        console.log(err);
        console.log('==========\n');
        /* eslint-enable */
        throw err;
      });
  }
}

function init (options) {
  return new Service(options);
}

Object.assign(init, Service, { extractAllItems, extractFirstItem }, runTime); // Attach props for convenience.

module.exports = init;
