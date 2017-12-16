/* eslint-disable */

const sqlBuilder = require('mongo-sql');
const convertArgsToParams = require('./convert-args-to-params');

module.exports = function convertArgsToWhere (graphqlOptions) {
  const dialect = graphqlOptions.dialect;
  
  return function convertArgsToWhereInner(table, args = {}, primaryKey = 'id', directiveQuery = {}) {
    const whereFeathers = Object.assign({},
      args.query || {},
      args.key ? { [primaryKey]: args.key } : {},
      directiveQuery,
    );

    delete whereFeathers.__sort;
    delete whereFeathers.__limit;
    delete whereFeathers.__skip;
    delete whereFeathers.$sort;
    delete whereFeathers.$limit;
    delete whereFeathers.$skip;
    
    const sqlResult = sqlBuilder.sql({
      type: 'select',
      table: table.substring(1, table.length - 1),
      where: convertArgsToParams(whereFeathers),
    });
    
    const sqlStmt = sqlResult.toString();
    const i = sqlStmt.indexOf(' where "');
    let where = i !== -1 ? sqlStmt.substr(i + 7) : '';
    
    sqlResult.values.forEach((value, i) => {
      value = typeof value === 'string' ? `"${value}"` : value;
      where = where.replace(`$${i + 1}`, value);
    });
    
    return where;
  }
};
