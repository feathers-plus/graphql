/* eslint no-unused-vars: 0 */

//!location: joins-imports

module.exports = function generatedSqlJoins(app, options) {
  let { convertArgsToFeathers, convertArgsToOrderBy, convertArgsToWhere } = options;
  let makeOrderBy = convertArgsToOrderBy(options);
  let makeWhere = convertArgsToWhere(options);
  //!location: joins-header

  let sqlJoins = {
    Comment: {
      // map the Comment schema to its SQL table
      sqlTable: 'Comments',
      uniqueKey: 'uuid',
      fields: {
        authorUuid: {
          sqlColumn: 'author_uuid'
          //!location: joins-Comment-authorUuid
        },
        postUuid: {
          sqlColumn: 'post_uuid'
          //!location: joins-Comment-postUuid
        },
        author: {
          // Join Comments.author_uuid = Accounts.uuid
          sqlJoin(ourTable, otherTable) { return ourTable + '.author_uuid = ' + otherTable + '.uuid'; },
          orderBy(args, content) { return makeOrderBy(args, null); },
          //!location: sql-join-Comment-author
          //!default
          where(table, args) { return makeWhere(table, args, 'author_uuid', undefined); }, // eslint-disable-line
          //!end
          //!location: joins-Comment-author
        },
        likes: {
          // Join Comments.uuid = Likes.comment_uuid
          sqlJoin(ourTable, otherTable) { return ourTable + '.uuid = ' + otherTable + '.comment_uuid'; },
          orderBy(args, content) { return makeOrderBy(args, { uuid: 1 }); },
          //!location: sql-join-Comment-likes
          //!default
          where(table, args) { return makeWhere(table, args, 'uuid', undefined); }, // eslint-disable-line
          //!end
          //!location: joins-Comment-likes
        },
        //!location: joins-Comment-*fields
      }
      //!location: joins-Comment
    },
    
    Like: {
      // map the Like schema to its SQL table
      sqlTable: 'Likes',
      uniqueKey: 'uuid',
      fields: {
        authorUuid: {
          sqlColumn: 'author_uuid'
          //!location: joins-Like-authorUuid
        },
        commentUuid: {
          sqlColumn: 'comment_uuid'
          //!location: joins-Like-commentUuid
        },
        author: {
          // Join Likes.author_uuid = Accounts.uuid
          sqlJoin(ourTable, otherTable) { return ourTable + '.author_uuid = ' + otherTable + '.uuid'; },
          orderBy(args, content) { return makeOrderBy(args, null); },
          //!location: sql-join-Like-author
          //!default
          where(table, args) { return makeWhere(table, args, 'author_uuid', undefined); }, // eslint-disable-line
          //!end
          //!location: joins-Like-author
        },
        comment: {
          // Join Likes.comment_uuid = Comments.uuid
          sqlJoin(ourTable, otherTable) { return ourTable + '.comment_uuid = ' + otherTable + '.uuid'; },
          orderBy(args, content) { return makeOrderBy(args, null); },
          //!location: sql-join-Like-comment
          //!default
          where(table, args) { return makeWhere(table, args, 'comment_uuid', undefined); }, // eslint-disable-line
          //!end
          //!location: joins-Like-comment
        },
        //!location: joins-Like-*fields
      }
      //!location: joins-Like
    },
    
    Post: {
      // map the Post schema to its SQL table
      sqlTable: 'Posts',
      uniqueKey: 'uuid',
      fields: {
        authorUuid: {
          sqlColumn: 'author_uuid'
          //!location: joins-Post-authorUuid
        },
        author: {
          // Join Posts.author_uuid = Accounts.uuid
          sqlJoin(ourTable, otherTable) { return ourTable + '.author_uuid = ' + otherTable + '.uuid'; },
          orderBy(args, content) { return makeOrderBy(args, null); },
          //!location: sql-join-Post-author
          //!default
          where(table, args) { return makeWhere(table, args, 'author_uuid', undefined); }, // eslint-disable-line
          //!end
          //!location: joins-Post-author
        },
        comments: {
          // Join Posts.uuid = Comments.post_uuid
          sqlJoin(ourTable, otherTable) { return ourTable + '.uuid = ' + otherTable + '.post_uuid'; },
          orderBy(args, content) { return makeOrderBy(args, { uuid: 1 }); },
          //!location: sql-join-Post-comments
          //!default
          where(table, args) { return makeWhere(table, args, 'uuid', undefined); }, // eslint-disable-line
          //!end
          //!location: joins-Post-comments
        },
        //!location: joins-Post-*fields
      }
      //!location: joins-Post
    },
    
    Relationship: {
      // map the Relationship schema to its SQL table
      sqlTable: 'Relationships',
      uniqueKey: 'uuid',
      fields: {
        followerUuid: {
          sqlColumn: 'follower_uuid'
          //!location: joins-Relationship-followerUuid
        },
        followeeUuid: {
          sqlColumn: 'followee_uuid'
          //!location: joins-Relationship-followeeUuid
        },
        follower: {
          // Join Relationships.follower_uuid = Accounts.uuid
          sqlJoin(ourTable, otherTable) { return ourTable + '.follower_uuid = ' + otherTable + '.uuid'; },
          orderBy(args, content) { return makeOrderBy(args, null); },
          //!location: sql-join-Relationship-follower
          //!default
          where(table, args) { return makeWhere(table, args, 'follower_uuid', undefined); }, // eslint-disable-line
          //!end
          //!location: joins-Relationship-follower
        },
        followee: {
          // Join Relationships.followee_uuid = Accounts.uuid
          sqlJoin(ourTable, otherTable) { return ourTable + '.followee_uuid = ' + otherTable + '.uuid'; },
          orderBy(args, content) { return makeOrderBy(args, null); },
          //!location: sql-join-Relationship-followee
          //!default
          where(table, args) { return makeWhere(table, args, 'followee_uuid', undefined); }, // eslint-disable-line
          //!end
          //!location: joins-Relationship-followee
        },
        //!location: joins-Relationship-*fields
      }
      //!location: joins-Relationship
    },
    
    User: {
      // map the User schema to its SQL table
      sqlTable: 'Accounts',
      uniqueKey: 'uuid',
      fields: {
        email: {
          sqlColumn: 'email_address'
          //!location: joins-User-email
        },
        firstName: {
          sqlColumn: 'first_name'
          //!location: joins-User-firstName
        },
        lastName: {
          sqlColumn: 'last_name'
          //!location: joins-User-lastName
        },
        fullName: {
          sqlExpr: (tableName, args) => `${tableName}.first_name || ' ' || ${tableName}.last_name`
          //!location: joins-User-fullName
        },
        posts: {
          // Join Accounts.uuid = Posts.author_uuid
          sqlJoin(ourTable, otherTable) { return ourTable + '.uuid = ' + otherTable + '.author_uuid'; },
          orderBy(args, content) { return makeOrderBy(args, { uuid: 1 }); },
          //!location: sql-join-User-posts
          //!default
          where(table, args) { return makeWhere(table, args, 'uuid', {"body":{"$ne":"xxx"}}); }, // eslint-disable-line
          //!end
          //!location: joins-User-posts
        },
        comments: {
          // Join Accounts.uuid = Comments.author_uuid
          sqlJoin(ourTable, otherTable) { return ourTable + '.uuid = ' + otherTable + '.author_uuid'; },
          orderBy(args, content) { return makeOrderBy(args, { uuid: 1 }); },
          //!location: sql-join-User-comments
          //!default
          where(table, args) { return makeWhere(table, args, 'uuid', undefined); }, // eslint-disable-line
          //!end
          //!location: joins-User-comments
        },
        followed_by: {
          // Join Accounts.uuid = Relationships.followee_uuid
          sqlJoin(ourTable, otherTable) { return ourTable + '.uuid = ' + otherTable + '.followee_uuid'; },
          orderBy(args, content) { return makeOrderBy(args, { uuid: -1 }); },
          //!location: sql-join-User-followed_by
          //!default
          where(table, args) { return makeWhere(table, args, 'uuid', undefined); }, // eslint-disable-line
          //!end
          //!location: joins-User-followed_by
        },
        following: {
          // Join Accounts.uuid = Relationships.follower_uuid
          sqlJoin(ourTable, otherTable) { return ourTable + '.uuid = ' + otherTable + '.follower_uuid'; },
          orderBy(args, content) { return makeOrderBy(args, { uuid: 1 }); },
          //!location: sql-join-User-following
          //!default
          where(table, args) { return makeWhere(table, args, 'uuid', undefined); }, // eslint-disable-line
          //!end
          //!location: joins-User-following
        },
        likes: {
          // Join Accounts.uuid = Likes.author_uuid
          sqlJoin(ourTable, otherTable) { return ourTable + '.uuid = ' + otherTable + '.author_uuid'; },
          orderBy(args, content) { return makeOrderBy(args, { uuid: 1 }); },
          //!location: sql-join-User-likes
          //!default
          where(table, args) { return makeWhere(table, args, 'uuid', undefined); }, // eslint-disable-line
          //!end
          //!location: joins-User-likes
        },
        //!location: joins-User-*fields
      }
      //!location: joins-User
    },
    
    Query: {
      fields: {
        getComment: {
          // Comment, feathers.get
          orderBy(args, content) { return makeOrderBy(args, { uuid: 1 }); },
          //!location: sql-join-Query-getComment
          //!default
          where(table, args) { return makeWhere(table, args, 'uuid'); },
          //!end
          //!location: joins-Query-getComment
        },
        findComment: {
          // Comment, feathers.find
          orderBy(args, content) { return makeOrderBy(args, { uuid: 1 }); },
          //!location: sql-join-Query-findComment
          //!default
          where(table, args) { return makeWhere(table, args, 'uuid'); },
          //!end
          //!location: joins-Query-findComment
        },
        getLike: {
          // Like, feathers.get
          orderBy(args, content) { return makeOrderBy(args, { uuid: 1 }); },
          //!location: sql-join-Query-getLike
          //!default
          where(table, args) { return makeWhere(table, args, 'uuid'); },
          //!end
          //!location: joins-Query-getLike
        },
        findLike: {
          // Like, feathers.find
          orderBy(args, content) { return makeOrderBy(args, { uuid: 1 }); },
          //!location: sql-join-Query-findLike
          //!default
          where(table, args) { return makeWhere(table, args, 'uuid'); },
          //!end
          //!location: joins-Query-findLike
        },
        getPost: {
          // Post, feathers.get
          orderBy(args, content) { return makeOrderBy(args, { uuid: 1 }); },
          //!location: sql-join-Query-getPost
          //!default
          where(table, args) { return makeWhere(table, args, 'uuid'); },
          //!end
          //!location: joins-Query-getPost
        },
        findPost: {
          // Post, feathers.find
          orderBy(args, content) { return makeOrderBy(args, { uuid: 1 }); },
          //!location: sql-join-Query-findPost
          //!default
          where(table, args) { return makeWhere(table, args, 'uuid'); },
          //!end
          //!location: joins-Query-findPost
        },
        getRelationship: {
          // Relationship, feathers.get
          orderBy(args, content) { return makeOrderBy(args, { uuid: 1 }); },
          //!location: sql-join-Query-getRelationship
          //!default
          where(table, args) { return makeWhere(table, args, 'uuid'); },
          //!end
          //!location: joins-Query-getRelationship
        },
        findRelationship: {
          // Relationship, feathers.find
          orderBy(args, content) { return makeOrderBy(args, { uuid: 1 }); },
          //!location: sql-join-Query-findRelationship
          //!default
          where(table, args) { return makeWhere(table, args, 'uuid'); },
          //!end
          //!location: joins-Query-findRelationship
        },
        getUser: {
          // User, feathers.get
          orderBy(args, content) { return makeOrderBy(args, { uuid: -1 }); },
          //!location: sql-join-Query-getUser
          //!default
          where(table, args) { return makeWhere(table, args, 'uuid'); },
          //!end
          //!location: joins-Query-getUser
        },
        findUser: {
          // User, feathers.find
          orderBy(args, content) { return makeOrderBy(args, { uuid: 1 }); },
          //!location: sql-join-Query-findUser
          //!default
          where(table, args) { return makeWhere(table, args, 'uuid'); },
          //!end
          //!location: joins-Query-findUser
        },
        //!location: joins-query
      },
    },
  };

  //!location: joins-return
  return sqlJoins;
};
//!location: joins-end
