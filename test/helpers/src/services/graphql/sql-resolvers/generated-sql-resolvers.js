/* eslint no-unused-vars: 0 */

//!location: sql-resolvers-imports

module.exports = function generatedSqlResolvers(app, options) {
  let { dialect, executeSql, genAndRunSql } = options;
  let genRunSql = genAndRunSql(executeSql, { dialect }, options);
  let sqlResolver = (parent, args, content, info) => genRunSql(content, info);
  //!location: sql-resolvers-header

  let sqlResolvers = {
    Comment: {
      //!location: sql-resolvers-Comment
    },
    
    Like: {
      //!location: sql-resolvers-Like
    },
    
    Post: {
      //!location: sql-resolvers-Post
    },
    
    Relationship: {
      //!location: sql-resolvers-Relationship
    },
    
    User: {
      //!location: sql-resolvers-User
    },
    
    Query: {
      // getComment(query: JSON, params: JSON, key: JSON): Comment
      //!location: sql-resolvers-Query-getComment
      //!default
      getComment: sqlResolver,
      //!end
      
      // findComment(query: JSON, params: JSON): [Comment!]
      //!location: sql-resolvers-Query-findComment
      //!default
      findComment: sqlResolver,
      //!end
      
      // getLike(query: JSON, params: JSON, key: JSON): Like
      //!location: sql-resolvers-Query-getLike
      //!default
      getLike: sqlResolver,
      //!end
      
      // findLike(query: JSON, params: JSON): [Like!]
      //!location: sql-resolvers-Query-findLike
      //!default
      findLike: sqlResolver,
      //!end
      
      // getPost(query: JSON, params: JSON, key: JSON): Post
      //!location: sql-resolvers-Query-getPost
      //!default
      getPost: sqlResolver,
      //!end
      
      // findPost(query: JSON, params: JSON): [Post!]
      //!location: sql-resolvers-Query-findPost
      //!default
      findPost: sqlResolver,
      //!end
      
      // getRelationship(query: JSON, params: JSON, key: JSON): Relationship
      //!location: sql-resolvers-Query-getRelationship
      //!default
      getRelationship: sqlResolver,
      //!end
      
      // findRelationship(query: JSON, params: JSON): [Relationship!]
      //!location: sql-resolvers-Query-findRelationship
      //!default
      findRelationship: sqlResolver,
      //!end
      
      // getUser(query: JSON, params: JSON, key: JSON): User
      //!location: sql-resolvers-Query-getUser
      //!default
      getUser: sqlResolver,
      //!end
      
      // findUser(query: JSON, params: JSON): [User!]
      //!location: sql-resolvers-Query-findUser
      //!default
      findUser: sqlResolver,
      //!end
      
      //!location: sql-resolvers-Query
    },
  };

  //!location: sql-resolvers-return
  return sqlResolvers;
};
//!location: sql-resolvers-end
