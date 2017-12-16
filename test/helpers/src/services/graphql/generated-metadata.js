
/* eslint indent: 0, quotes: 0 */
//!location: metadata-imports

let generatedMetadata = {
    "Comment": {
      "service": "comment",
      "key": "uuid",
      "sqlTable": "Comments",
      "sqlKey": "uuid",
      "fields": {
        "authorUuid": {
          "sqlColumn": "author_uuid"
        },
        "postUuid": {
          "sqlColumn": "post_uuid"
        }
      }
    },
    "Like": {
      "service": "like",
      "key": "uuid",
      "sqlTable": "Likes",
      "sqlKey": "uuid",
      "fields": {
        "authorUuid": {
          "sqlColumn": "author_uuid"
        },
        "commentUuid": {
          "sqlColumn": "comment_uuid"
        }
      }
    },
    "Post": {
      "service": "post",
      "key": "uuid",
      "sqlTable": "Posts",
      "sqlKey": "uuid",
      "fields": {
        "authorUuid": {
          "sqlColumn": "author_uuid"
        }
      }
    },
    "Relationship": {
      "service": "relationship",
      "key": "uuid",
      "sqlTable": "Relationships",
      "sqlKey": "uuid",
      "fields": {
        "followerUuid": {
          "sqlColumn": "follower_uuid"
        },
        "followeeUuid": {
          "sqlColumn": "followee_uuid"
        }
      }
    },
    "User": {
      "service": "user",
      "key": "uuid",
      "sqlTable": "Accounts",
      "sqlKey": "uuid",
      "fields": {
        "email": {
          "sqlColumn": "email_address"
        },
        "firstName": {
          "sqlColumn": "first_name"
        },
        "lastName": {
          "sqlColumn": "last_name"
        },
        "fullName": {
          "sqlExpr": "(tableName, args) => `${tableName}.first_name || ' ' || ${tableName}.last_name`"
        }
      }
    }
  };

//!location: metadata-export
//!default
module.exports = generatedMetadata;
//!end

//!location: metadata-end
