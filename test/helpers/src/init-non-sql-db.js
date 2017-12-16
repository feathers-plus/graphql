
const log = false;

let userDb;
let commentsDb;
let postDb;
let relationshipDb;

module.exports = function initNonSqlDb (app) {
  const user = app.service('user');
  const post = app.service('post');
  const comments = app.service('comment');
  const like = app.service('like');
  const relationship = app.service('relationship');

  return Promise.all([
    user.remove(null, { query: {} }),
    comments.remove(null, { query: {} }),
    post.remove(null, { query: {} }),
    like.remove(null, { query: {} }),
    relationship.remove(null, { query: {} })
  ])
    .then(() => Promise.all([
      user.create({ uuid: 0, firstName: 'John', lastName: 'Szwaronek', email: 'john@gmail.com' }),
      user.create({ uuid: 1, firstName: 'Jessica', lastName: 'Szwaronek', email: 'jessica@gmail.com' }),
      user.create({ uuid: 2, firstName: 'Nick', lastName: 'Roussis', email: 'nick@gmail.com' }),
      user.create({ uuid: 3, firstName: 'Barbara', lastName: 'Lewis', email: 'barbara@gmail.com' })
    ]))
    .then(() => user.find())
    .then(result => {
      userDb = result.sort(sort('uuid'));
      if (log) console.log('userDB\n', userDb); // eslint-disable-line
    })

    .then(() => Promise.all([
      post.create({ uuid: 90, authorUuid: userDb[0].uuid, body: 'Post 1', draft: 0 }),
      post.create({ uuid: 91, authorUuid: userDb[3].uuid, body: 'Post 2', draft: 0 }),
      post.create({ uuid: 92, authorUuid: userDb[1].uuid, body: 'Post 3', draft: 1 }),
      post.create({ uuid: 93, authorUuid: userDb[1].uuid, body: 'Post 4', draft: 0 }),
      post.create({ uuid: 94, authorUuid: userDb[1].uuid, body: 'Post 5', draft: 0 })
    ]))
    .then(() => post.find())
    .then(result => {
      postDb = result.sort(sort('uuid'));
      if (log) console.log('postDB\n', postDb); // eslint-disable-line
    })

    .then(() => Promise.all([
      comments.create({ uuid: 10, authorUuid: userDb[0].uuid, postUuid: postDb[0].uuid, body: 'Comment 1', archived: 0 }),
      comments.create({ uuid: 11, authorUuid: userDb[0].uuid, postUuid: postDb[0].uuid, body: 'Comment 2', archived: 0 }),
      comments.create({ uuid: 12, authorUuid: userDb[1].uuid, postUuid: postDb[0].uuid, body: 'Comment 3', archived: 0 }),
      comments.create({ uuid: 13, authorUuid: userDb[1].uuid, postUuid: postDb[1].uuid, body: 'Comment 4', archived: 0 }),
      comments.create({ uuid: 14, authorUuid: userDb[2].uuid, postUuid: postDb[1].uuid, body: 'Comment 5', archived: 0 }),
      comments.create({ uuid: 15, authorUuid: userDb[3].uuid, postUuid: postDb[1].uuid, body: 'Comment 6', archived: 1 })
    ]))
    .then(() => comments.find())
    .then(result => {
      commentsDb = result.sort(sort('uuid'));
      if (log) console.log('commentsDB\n', commentsDb); // eslint-disable-line
    })

    .then(() => Promise.all(makelike(like)))
    .then(() => like.find())
    .then(result => {
      const likeDb = result.sort(sort('uuid'));
      if (log) console.log(likeDb); // eslint-disable-line
    })

    .then(() => Promise.all([
      relationship.create({ uuid: 80, followerUuid: userDb[0].uuid, followeeUuid: userDb[1].uuid }),
      relationship.create({ uuid: 81, followerUuid: userDb[2].uuid, followeeUuid: userDb[1].uuid }),
      relationship.create({ uuid: 82, followerUuid: userDb[3].uuid, followeeUuid: userDb[1].uuid }),
      relationship.create({ uuid: 83, followerUuid: userDb[1].uuid, followeeUuid: userDb[3].uuid })
    ]))
    .then(() => relationship.find())
    .then(result => {
      relationshipDb = result.sort(sort('uuid'));
      if (log) console.log('relationshipDB\n', relationshipDb); // eslint-disable-line
    })

    .catch(err => {
      console.log(err); // eslint-disable-line
      throw err;
    });
};

function sort (prop) {
  return (a, b) => a[prop] > b[prop] ? 1 : (a[prop] < b[prop] ? -1 : 0);
}

function makelike (like) {
  const likePromises = [];
  let incr = 99;

  for (let i = 0; i < userDb.length; i++) {
    for (let j = 0; j < commentsDb.length; j++) {
      const data = { uuid: ++incr, authorUuid: userDb[i].uuid, commentUuid: commentsDb[j].uuid };
      likePromises.push(like.create(data));
    }
  }

  return likePromises;
}
