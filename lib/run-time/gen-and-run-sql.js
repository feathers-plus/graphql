
const joinMonster = require('join-monster').default;
const makeDebug = require('debug');

const debug = makeDebug('feathers:io');

module.exports = function genAndRunSql (execSql, jmOptions, options) {
  return (context, info) => joinMonster(
    info,
    context,
    sql => {
      if (options.logSql) {
        console.log('\nexecuteSql\n', sql); // eslint-disable-line
      }

      debug('Execute SQL:', sql);
      return execSql(sql);
    },
    jmOptions
  );
};
