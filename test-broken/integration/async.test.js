
const { assert } = require('chai');

const createApp = require('../helpers/src/app');
const compileSchemas = require('../helpers/src/services/graphql/compile-schemas');
const asyncTest = require('../helpers/src/async-test');
const initDb = require('../helpers/src/init-db');

let app;

describe('async.test.js', () => {
  before(() => {
    app = createApp(true);
    return initDb(app) // write data for tests
      .then(() => {
        compileSchemas(); // generate code used by tests
      });
  });

  afterEach(() => {
    const sqlDb = app.service('graphql').sqlDb;

    if (sqlDb) {
      sqlDb.close();
    }
  });

  it('runs interleaved tests - services', function () {
    this.timeout(5000);

    app = createApp(false);
    return asyncTest(app, 10)
      .then(() => assert(true));
  });

  it('runs interleaved tests - SQL', function () {
    this.timeout(5000);

    app = createApp(true);
    return asyncTest(app, 10)
      .then(() => assert(true));
  });
});
