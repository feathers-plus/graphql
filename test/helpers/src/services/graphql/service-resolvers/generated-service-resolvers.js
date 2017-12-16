/* eslint no-unused-vars: 0 */

const deepMerge = require('deepmerge'); // eslint-disable-line
const debug = require('debug')('feathers:io');
//!location: resolvers-imports

module.exports = function generatedServiceResolvers(app, options) {
  let { convertArgsToParams, convertArgsToFeathers, extractAllItems, extractFirstItem, // eslint-disable-line
    feathersDataLoader: { feathersDataLoader } } = options; 
  //!location: resolvers-header

  let resolvers = {
    Comment: {
      // author: User!, where Comment.authorUuid: User.uuid
      // Comment.authorUuid ==> persisted DataLoader key ==> User.uuid
      author({ authorUuid }, args, content, info) {
        let dataLoaderName = 'user_uuid';
        let persisted = content.dataLoaders.persisted;
        //!location: resolvers-Comment-author-header
        if (persisted[dataLoaderName]) return persisted[dataLoaderName].load(authorUuid);
      
        let feathersParams = convertArgsToFeathers(args);
        //!location: resolvers-Comment-author-params
      
        persisted[dataLoaderName] = feathersDataLoader(dataLoaderName, '!', 'uuid',
          keys => {
            feathersParams.query.uuid = { $in: keys };
            debug('Execute user.find(', feathersParams, ');');
            //!location: resolvers-Comment-author-keys-return
            return options.services.user.find(feathersParams);
          },
          50
        );
      
        //!location: resolvers-Comment-author-result
        return persisted[dataLoaderName].load(authorUuid);
      },
      
      // likes: [Like!], where Comment.uuid: [Like.commentUuid]
      // Comment.uuid ==> shareable DataLoader key ==> [Like.commentUuid], sorted by uuid 
      likes({ uuid }, args, content, info) {
        let dataLoaderName = 'like_commentUuid_list_$sort_uuid';
        let shareable = content.dataLoaders.shareable;
        //!location: resolvers-Comment-likes-header
        if (shareable[dataLoaderName]) return shareable[dataLoaderName].load(uuid);
      
        let feathersParams = convertArgsToFeathers(args, [
          { query : { $sort: { uuid: 1 } } },
        ]);
        //!location: resolvers-Comment-likes-params
      
        shareable[dataLoaderName] = feathersDataLoader(dataLoaderName, '[!]', 'commentUuid',
          keys => {
            feathersParams.query.commentUuid = { $in: keys };
            debug('Execute like.find(', feathersParams, ');');
            //!location: resolvers-Comment-likes-keys-return
            return options.services.like.find(feathersParams);
          }
        );
      
        //!location: resolvers-Comment-likes-result
        return shareable[dataLoaderName].load(uuid);
      },
      //!location: resolvers-Comment
    },
    
    Like: {
      // author: User!, where Like.authorUuid: User.uuid
      // Like.authorUuid ==> persisted DataLoader key ==> User.uuid
      author({ authorUuid }, args, content, info) {
        let dataLoaderName = 'user_uuid';
        let persisted = content.dataLoaders.persisted;
        //!location: resolvers-Like-author-header
        if (persisted[dataLoaderName]) return persisted[dataLoaderName].load(authorUuid);
      
        let feathersParams = convertArgsToFeathers(args);
        //!location: resolvers-Like-author-params
      
        persisted[dataLoaderName] = feathersDataLoader(dataLoaderName, '!', 'uuid',
          keys => {
            feathersParams.query.uuid = { $in: keys };
            debug('Execute user.find(', feathersParams, ');');
            //!location: resolvers-Like-author-keys-return
            return options.services.user.find(feathersParams);
          },
          100
        );
      
        //!location: resolvers-Like-author-result
        return persisted[dataLoaderName].load(authorUuid);
      },
      
      // comment: Comment!, where Like.commentUuid: Comment.uuid
      // Like.commentUuid ==> shareable DataLoader key ==> Comment.uuid
      comment({ commentUuid }, args, content, info) {
        let dataLoaderName = 'comment_uuid';
        let shareable = content.dataLoaders.shareable;
        //!location: resolvers-Like-comment-header
        if (shareable[dataLoaderName]) return shareable[dataLoaderName].load(commentUuid);
      
        let feathersParams = convertArgsToFeathers(args);
        //!location: resolvers-Like-comment-params
      
        shareable[dataLoaderName] = feathersDataLoader(dataLoaderName, '!', 'uuid',
          keys => {
            feathersParams.query.uuid = { $in: keys };
            debug('Execute comment.find(', feathersParams, ');');
            //!location: resolvers-Like-comment-keys-return
            return options.services.comment.find(feathersParams);
          }
        );
      
        //!location: resolvers-Like-comment-result
        return shareable[dataLoaderName].load(commentUuid);
      },
      //!location: resolvers-Like
    },
    
    Post: {
      // author: User!, where Post.authorUuid: User.uuid
      // Post.authorUuid ==> persisted DataLoader key ==> User.uuid
      author({ authorUuid }, args, content, info) {
        let dataLoaderName = 'user_uuid';
        let persisted = content.dataLoaders.persisted;
        //!location: resolvers-Post-author-header
        if (persisted[dataLoaderName]) return persisted[dataLoaderName].load(authorUuid);
      
        let feathersParams = convertArgsToFeathers(args);
        //!location: resolvers-Post-author-params
      
        persisted[dataLoaderName] = feathersDataLoader(dataLoaderName, '!', 'uuid',
          keys => {
            feathersParams.query.uuid = { $in: keys };
            debug('Execute user.find(', feathersParams, ');');
            //!location: resolvers-Post-author-keys-return
            return options.services.user.find(feathersParams);
          },
          100
        );
      
        //!location: resolvers-Post-author-result
        return persisted[dataLoaderName].load(authorUuid);
      },
      
      // comments: [Comment!], where Post.uuid: [Comment.postUuid]
      // Post.uuid ==> shareable DataLoader key ==> [Comment.postUuid], sorted by uuid 
      comments({ uuid }, args, content, info) {
        let dataLoaderName = 'comment_postUuid_list_$sort_uuid';
        let shareable = content.dataLoaders.shareable;
        //!location: resolvers-Post-comments-header
        if (shareable[dataLoaderName]) return shareable[dataLoaderName].load(uuid);
      
        let feathersParams = convertArgsToFeathers(args, [
          { query : { $sort: { uuid: 1 } } },
        ]);
        //!location: resolvers-Post-comments-params
      
        shareable[dataLoaderName] = feathersDataLoader(dataLoaderName, '[!]', 'postUuid',
          keys => {
            feathersParams.query.postUuid = { $in: keys };
            debug('Execute comment.find(', feathersParams, ');');
            //!location: resolvers-Post-comments-keys-return
            return options.services.comment.find(feathersParams);
          }
        );
      
        //!location: resolvers-Post-comments-result
        return shareable[dataLoaderName].load(uuid);
      },
      //!location: resolvers-Post
    },
    
    Relationship: {
      // follower: User!, where Relationship.followerUuid: User.uuid
      // Relationship.followerUuid ==> persisted DataLoader key ==> User.uuid
      follower({ followerUuid }, args, content, info) {
        let dataLoaderName = 'user_uuid';
        let persisted = content.dataLoaders.persisted;
        //!location: resolvers-Relationship-follower-header
        if (persisted[dataLoaderName]) return persisted[dataLoaderName].load(followerUuid);
      
        let feathersParams = convertArgsToFeathers(args);
        //!location: resolvers-Relationship-follower-params
      
        persisted[dataLoaderName] = feathersDataLoader(dataLoaderName, '!', 'uuid',
          keys => {
            feathersParams.query.uuid = { $in: keys };
            debug('Execute user.find(', feathersParams, ');');
            //!location: resolvers-Relationship-follower-keys-return
            return options.services.user.find(feathersParams);
          },
          100
        );
      
        //!location: resolvers-Relationship-follower-result
        return persisted[dataLoaderName].load(followerUuid);
      },
      
      // followee: User!, where Relationship.followeeUuid: User.uuid
      // Relationship.followeeUuid ==> persisted DataLoader key ==> User.uuid
      followee({ followeeUuid }, args, content, info) {
        let dataLoaderName = 'user_uuid';
        let persisted = content.dataLoaders.persisted;
        //!location: resolvers-Relationship-followee-header
        if (persisted[dataLoaderName]) return persisted[dataLoaderName].load(followeeUuid);
      
        let feathersParams = convertArgsToFeathers(args);
        //!location: resolvers-Relationship-followee-params
      
        persisted[dataLoaderName] = feathersDataLoader(dataLoaderName, '!', 'uuid',
          keys => {
            feathersParams.query.uuid = { $in: keys };
            debug('Execute user.find(', feathersParams, ');');
            //!location: resolvers-Relationship-followee-keys-return
            return options.services.user.find(feathersParams);
          },
          100
        );
      
        //!location: resolvers-Relationship-followee-result
        return persisted[dataLoaderName].load(followeeUuid);
      },
      //!location: resolvers-Relationship
    },
    
    User: {
      // fullName: String!
      fullName(parent, args, content, info) {
        //!location: resolvers-User-fullName-result
        //!default
        return parent.firstName + ' ' + parent.lastName;
        //!end
      },
      
      // posts(query: JSON, params: JSON): [Post!], where User.uuid: [Post.authorUuid]
      // User.uuid ==> non-shareable DataLoader key ==> [Post.authorUuid], sorted by uuid 
      posts({ uuid }, args, content, info) {
        let dataLoaderName = 'User_post_authorUuid_list_$sort_uuid_$hash_149d7454';
        let nonShareable = content.dataLoaders.nonShareable;
        //!location: resolvers-User-posts-header
        if (nonShareable[dataLoaderName]) return nonShareable[dataLoaderName].load(uuid);
      
        let feathersParams = convertArgsToFeathers(args, [
          { query : { $sort: { uuid: 1 } } },
          { query: {"body":{"$ne":"xxx"}} }, // eslint-disable-line
        ]);
        //!location: resolvers-User-posts-params
      
        nonShareable[dataLoaderName] = feathersDataLoader(dataLoaderName, '[!]', 'authorUuid',
          keys => {
            feathersParams.query.authorUuid = { $in: keys };
            debug('Execute post.find(', feathersParams, ');');
            //!location: resolvers-User-posts-keys-return
            return options.services.post.find(feathersParams);
          }
        );
      
        //!location: resolvers-User-posts-result
        return nonShareable[dataLoaderName].load(uuid);
      },
      
      // comments: [Comment!], where User.uuid: [Comment.authorUuid]
      // User.uuid ==> shareable DataLoader key ==> [Comment.authorUuid], sorted by uuid 
      comments({ uuid }, args, content, info) {
        let dataLoaderName = 'comment_authorUuid_list_$sort_uuid';
        let shareable = content.dataLoaders.shareable;
        //!location: resolvers-User-comments-header
        if (shareable[dataLoaderName]) return shareable[dataLoaderName].load(uuid);
      
        let feathersParams = convertArgsToFeathers(args, [
          { query : { $sort: { uuid: 1 } } },
        ]);
        //!location: resolvers-User-comments-params
      
        shareable[dataLoaderName] = feathersDataLoader(dataLoaderName, '[!]', 'authorUuid',
          keys => {
            feathersParams.query.authorUuid = { $in: keys };
            debug('Execute comment.find(', feathersParams, ');');
            //!location: resolvers-User-comments-keys-return
            return options.services.comment.find(feathersParams);
          }
        );
      
        //!location: resolvers-User-comments-result
        return shareable[dataLoaderName].load(uuid);
      },
      
      // followed_by: [Relationship!], where User.uuid: [Relationship.followeeUuid]
      // User.uuid ==> shareable DataLoader key ==> [Relationship.followeeUuid], sorted by uuid DESC
      followed_by({ uuid }, args, content, info) {
        let dataLoaderName = 'relationship_followeeUuid_list_$sort_uuid_DESC';
        let shareable = content.dataLoaders.shareable;
        //!location: resolvers-User-followed_by-header
        if (shareable[dataLoaderName]) return shareable[dataLoaderName].load(uuid);
      
        let feathersParams = convertArgsToFeathers(args, [
          { query : { $sort: { uuid: -1 } } },
        ]);
        //!location: resolvers-User-followed_by-params
      
        shareable[dataLoaderName] = feathersDataLoader(dataLoaderName, '[!]', 'followeeUuid',
          keys => {
            feathersParams.query.followeeUuid = { $in: keys };
            debug('Execute relationship.find(', feathersParams, ');');
            //!location: resolvers-User-followed_by-keys-return
            return options.services.relationship.find(feathersParams);
          }
        );
      
        //!location: resolvers-User-followed_by-result
        return shareable[dataLoaderName].load(uuid);
      },
      
      // following: [Relationship!], where User.uuid: [Relationship.followerUuid]
      // User.uuid ==> shareable DataLoader key ==> [Relationship.followerUuid], sorted by uuid 
      following({ uuid }, args, content, info) {
        let dataLoaderName = 'relationship_followerUuid_list_$sort_uuid';
        let shareable = content.dataLoaders.shareable;
        //!location: resolvers-User-following-header
        if (shareable[dataLoaderName]) return shareable[dataLoaderName].load(uuid);
      
        let feathersParams = convertArgsToFeathers(args, [
          { query : { $sort: { uuid: 1 } } },
        ]);
        //!location: resolvers-User-following-params
      
        shareable[dataLoaderName] = feathersDataLoader(dataLoaderName, '[!]', 'followerUuid',
          keys => {
            feathersParams.query.followerUuid = { $in: keys };
            debug('Execute relationship.find(', feathersParams, ');');
            //!location: resolvers-User-following-keys-return
            return options.services.relationship.find(feathersParams);
          }
        );
      
        //!location: resolvers-User-following-result
        return shareable[dataLoaderName].load(uuid);
      },
      
      // likes: [Like!], where User.uuid: [Like.authorUuid]
      // User.uuid ==> shareable DataLoader key ==> [Like.authorUuid], sorted by uuid 
      likes({ uuid }, args, content, info) {
        let dataLoaderName = 'like_authorUuid_list_$sort_uuid_$hash_344c7ec8';
        let shareable = content.dataLoaders.shareable;
        //!location: resolvers-User-likes-header
        if (shareable[dataLoaderName]) return shareable[dataLoaderName].load(uuid);
      
        let feathersParams = convertArgsToFeathers(args, [
          { query : { $sort: { uuid: 1 } } },
          {"test1":true}, // eslint-disable-line
        ]);
        //!location: resolvers-User-likes-params
      
        shareable[dataLoaderName] = feathersDataLoader(dataLoaderName, '[!]', 'authorUuid',
          keys => {
            feathersParams.query.authorUuid = { $in: keys };
            debug('Execute like.find(', feathersParams, ');');
            //!location: resolvers-User-likes-keys-return
            return options.services.like.find(feathersParams);
          }
        );
      
        //!location: resolvers-User-likes-result
        return shareable[dataLoaderName].load(uuid);
      },
      //!location: resolvers-User
    },
    
    /*
     Shareable DataLoaders shared by more than one resolver
       user_uuid
         // author: User!, where Comment.authorUuid: User.uuid
         // author: User!, where Like.authorUuid: User.uuid
         // author: User!, where Post.authorUuid: User.uuid
         // follower: User!, where Relationship.followerUuid: User.uuid
         // followee: User!, where Relationship.followeeUuid: User.uuid
    */
    
    Query: {
      // getComment(query: JSON, params: JSON, key: JSON): Comment
      getComment(parent, args, content, info) {
        let feathersParams = convertArgsToFeathers(args, [
          { query : { $sort: { uuid: 1 } } },
        ]);
        //!location: resolvers-Query-getComment-params
        let result = options.services.comment.get(args.key, feathersParams).then(extractFirstItem);
        //!location: resolvers-Query-getComment-result
        return result;
      },
      
      // findComment(query: JSON, params: JSON): [Comment!]
      findComment(parent, args, content, info) {
        let feathersParams = convertArgsToFeathers(args, [
          { query : { $sort: { uuid: 1 } } },
        ]);
        //!location: resolvers-Query-findComment-params
        let result = options.services.comment.find(feathersParams).then(extractAllItems);
        //!location: resolvers-Query-findComment-result
        return result;
      },
      
      // getLike(query: JSON, params: JSON, key: JSON): Like
      getLike(parent, args, content, info) {
        let feathersParams = convertArgsToFeathers(args, [
          { query : { $sort: { uuid: 1 } } },
        ]);
        //!location: resolvers-Query-getLike-params
        let result = options.services.like.get(args.key, feathersParams).then(extractFirstItem);
        //!location: resolvers-Query-getLike-result
        return result;
      },
      
      // findLike(query: JSON, params: JSON): [Like!]
      findLike(parent, args, content, info) {
        let feathersParams = convertArgsToFeathers(args, [
          { query : { $sort: { uuid: 1 } } },
        ]);
        //!location: resolvers-Query-findLike-params
        let result = options.services.like.find(feathersParams).then(extractAllItems);
        //!location: resolvers-Query-findLike-result
        return result;
      },
      
      // getPost(query: JSON, params: JSON, key: JSON): Post
      getPost(parent, args, content, info) {
        let feathersParams = convertArgsToFeathers(args, [
          { query : { $sort: { uuid: 1 } } },
        ]);
        //!location: resolvers-Query-getPost-params
        let result = options.services.post.get(args.key, feathersParams).then(extractFirstItem);
        //!location: resolvers-Query-getPost-result
        return result;
      },
      
      // findPost(query: JSON, params: JSON): [Post!]
      findPost(parent, args, content, info) {
        let feathersParams = convertArgsToFeathers(args, [
          { query : { $sort: { uuid: 1 } } },
        ]);
        //!location: resolvers-Query-findPost-params
        let result = options.services.post.find(feathersParams).then(extractAllItems);
        //!location: resolvers-Query-findPost-result
        return result;
      },
      
      // getRelationship(query: JSON, params: JSON, key: JSON): Relationship
      getRelationship(parent, args, content, info) {
        let feathersParams = convertArgsToFeathers(args, [
          { query : { $sort: { uuid: 1 } } },
        ]);
        //!location: resolvers-Query-getRelationship-params
        let result = options.services.relationship.get(args.key, feathersParams).then(extractFirstItem);
        //!location: resolvers-Query-getRelationship-result
        return result;
      },
      
      // findRelationship(query: JSON, params: JSON): [Relationship!]
      findRelationship(parent, args, content, info) {
        let feathersParams = convertArgsToFeathers(args, [
          { query : { $sort: { uuid: 1 } } },
        ]);
        //!location: resolvers-Query-findRelationship-params
        let result = options.services.relationship.find(feathersParams).then(extractAllItems);
        //!location: resolvers-Query-findRelationship-result
        return result;
      },
      
      // getUser(query: JSON, params: JSON, key: JSON): User
      getUser(parent, args, content, info) {
        let feathersParams = convertArgsToFeathers(args, [
          { query : { $sort: { uuid: -1 } } },
        ]);
        //!location: resolvers-Query-getUser-params
        let result = options.services.user.get(args.key, feathersParams).then(extractFirstItem);
        //!location: resolvers-Query-getUser-result
        return result;
      },
      
      // findUser(query: JSON, params: JSON): [User!]
      findUser(parent, args, content, info) {
        let feathersParams = convertArgsToFeathers(args, [
          { query : { $sort: { uuid: 1 } } },
          {"test2":true}, // eslint-disable-line
        ]);
        //!location: resolvers-Query-findUser-params
        let result = options.services.user.find(feathersParams).then(extractAllItems);
        //!location: resolvers-Query-findUser-result
        return result;
      },
      //!location: resolvers-query
    },
  };

  //!location: resolvers-return
  return resolvers;
};
//!location: resolvers-end
