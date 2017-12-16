
const feathers = require('feathers');
const hooks = require('feathers-hooks');
const sqlite = require('sqlite');
const { cwd } = require('process');
const { join } = require('path');

const services = require('./services');

module.exports = function createApp (usingSql) {
  const app = feathers();
  app.configure(hooks());

  // Fake the config.
  app.set('paginate', {});
  app.set('nedb', '../data');
  app.set('graphql', {
    usingSql,
    sql: {
      dialect: 'sqlite3',
      openDb: () => {
        sqlite.open(join(cwd(), 'test', 'helpers', 'data', 'sqlite3.db'));
        return sqlite;
      },
      executeSql: sql => {
        /*
        if (sql.substr(0, 19) === 'SELECT\n  "findUser"') {
          console.log(sql);
        }
        */
        // console.log(sql);
        return sqlite.all(sql)
          .catch(err => {
            console.log('test:executeSql error=', err.message);
            throw err;
          });
      }
    }
  });

  app.configure(services);
  app.setup();

  return app;
};
