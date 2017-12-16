
const log = false;
let results;
let sqlDb;

module.exports = async function initSqlDb (app) { // eslint-disable-line
  const comment = app.service('comment');
  const like = app.service('like');
  const post = app.service('post');
  const relationship = app.service('relationship');
  const user = app.service('user');

  sqlDb = app.service('graphql').sqlDb;

  results = await user.find({ query: { $sort: { uuid: 1 } } });
  await copyServiceToTable(results, 'Accounts', {
    columns: {
      uuid: { type: 'INTEGER PRIMARY KEY' },
      firstName: { name: 'first_name' },
      lastName: { name: 'last_name' },
      email: { name: 'email_address' }
    }
  });

  results = await post.find({ query: { $sort: { uuid: 1 } } });
  await copyServiceToTable(results, 'Posts', {
    columns: {
      uuid: { type: 'INTEGER PRIMARY KEY' },
      authorUuid: { name: 'author_uuid' }
    }
  });

  results = await comment.find({ query: { $sort: { uuid: 1 } } });
  await copyServiceToTable(results, 'Comments', {
    columns: {
      uuid: { type: 'INTEGER PRIMARY KEY' },
      authorUuid: { name: 'author_uuid' },
      postUuid: { name: 'post_uuid' }
    }
  });

  results = await like.find({ query: { $sort: { uuid: 1 } } });
  await copyServiceToTable(results, 'Likes', {
    columns: {
      uuid: { type: 'INTEGER PRIMARY KEY' },
      authorUuid: { name: 'author_uuid' },
      commentUuid: { name: 'comment_uuid' }
    }
  });

  results = await relationship.find({ query: { $sort: { uuid: 1 } } });
  await copyServiceToTable(results, 'Relationships', {
    columns: {
      uuid: { type: 'INTEGER PRIMARY KEY' },
      followerUuid: { name: 'follower_uuid' },
      followeeUuid: { name: 'followee_uuid' }
    }
  });
};

// todo enhancement: ensure support for different flavors of SQL
async function copyServiceToTable (data, tableName, options = {}) {
  let columns = options.columns || {};

  if (typeof tableName !== 'string' || !tableName) throw new Error('No table name provided. (copyServiceToTable)');
  if (!Array.isArray(data)) throw new Error(`"${tableName}" data is not an array. (copyServiceToTable)`);

  if (!data.length && !columns) throw new Error(`"${tableName}" has no data and no column info is provided. (copyServiceToTable)`);

  const sample = data[0];
  if (typeof sample !== 'object' || sample === null) throw new Error(`"${tableName}" has no data[0] not an object. (copyServiceToTable)`);

  const expandedColumns = Object.keys(sample).reduce((expandedColumns, key) => {
    expandedColumns[key] = columns[key] || {};
    const expandedColumn = expandedColumns[key];

    if (!expandedColumn.name) expandedColumn.name = key;
    if (!expandedColumn.type) expandedColumn.type = typeof sample[key] === 'string' ? 'TEXT' : 'INTEGER';

    return expandedColumns;
  }, {});

  const schema = Object.keys(expandedColumns).reduce((schema, key, i) => {
    const column = expandedColumns[key];
    return `${schema}${i ? ', ' : ''}${column.name} ${column.type || 'TEXT'}`;
  }, '');

  const fieldList = Object.keys(expandedColumns).reduce((fieldList, key, i) => {
    const column = expandedColumns[key];
    return `${fieldList}${i ? ', ' : ''}${column.name}`;
  }, '');

  await sqlDb.run(`DROP TABLE IF EXISTS ${tableName}`);
  await sqlDb.run(`CREATE TABLE ${tableName} (${schema})`);

  for (let i = 0, lenI = data.length; i < lenI; i++) {
    const valueList = Object.keys(expandedColumns).reduce((valueList, key, j) => {
      const { type } = expandedColumns[key];
      const quote = type && type !== 'TEXT' ? '' : '"';
      let value = data[i][key];
      return `${valueList}${j ? ', ' : ''}${quote}${value}${quote}`;
    }, '');

    await sqlDb.run(`INSERT INTO ${tableName} (${fieldList}) VALUES (${valueList})`);
  }

  const all = await sqlDb.all(`SELECT * FROM ${tableName}`);
  if (log) console.log(`\n${tableName}:`, all);
}
