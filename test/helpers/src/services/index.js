const comment = require('./comment/comment.service.js');
const like = require('./like/like.service.js');
const post = require('./post/post.service.js');
const relationship = require('./relationship/relationship.service.js');
const user = require('./user/user.service.js');
const graphql = require('./graphql/graphql.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(comment);
  app.configure(like);
  app.configure(post);
  app.configure(relationship);
  app.configure(user);
  app.configure(graphql);
};
