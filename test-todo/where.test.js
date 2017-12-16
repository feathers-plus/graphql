
const builder = require('mongo-sql');
const { inspect } = require('util');

const usersQuery = {
  type: 'select',
  table: 'users',
  where: { $or: { id: 5, name: 'Bob' } }
};

describe('where.test', () => {
  it('test', () => {
    const result = builder.sql(usersQuery);

    /* eslint-disable */
    console.log('result=', show(result));
    console.log('values=', show(result.values));     // Array of values
    console.log('toString()=', show(result.toString())); // Sql string value
    console.log('toQuery()=', show(result.toQuery()));
    /* eslint-enable */

    const str = result.toString();
    const startWhere = str.indexOf(' where "');

    /* eslint-disable */
    console.log('startWhere=', startWhere);
    console.log('where=', '>>>' + str.substr(startWhere + 1) + '<<<');
    /* eslint-enable */
  });
});

function show (obj) {
  return inspect(obj, { colors: true, depth: 5 });
}
