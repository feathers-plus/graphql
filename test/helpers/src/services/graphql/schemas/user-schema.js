
// Example of defining a GraphQL schema using vanilla JavaScript.
module.exports = `
  type User {
    _id: ID!
    uuid: ID!                                   @feathers(service: "user", key: "uuid", sqlTable: "Accounts", sqlKey: "uuid")
    email: String!                              @sql(sqlColumn: "email_address")
    firstName: String!                          @sql(sqlColumn: "first_name")
    lastName: String!                           @sql(sqlColumn: "last_name")
    fullName: String!                           @resolver(template: "returns", result: "parent.firstName + ' ' + parent.lastName", sql: false)
                                                @sql(sqlExpr: "(tableName, args) => \`\${tableName}.first_name || ' ' || \${tableName}.last_name\`")
    posts(query: JSON, params: JSON): [Post!]   @resolver(template: "non-shareable", keyHere: "uuid", keyThere: "authorUuid",   sort: "uuid", query: "{body:{$ne:'xxx'}}")
    comments: [Comment!]                        @resolver(template: "shareable",     keyHere: "uuid", keyThere: "authorUuid",   sort: "uuid")
    followed_by: [Relationship!]                @resolver(template: "shareable",     keyHere: "uuid", keyThere: "followeeUuid", sort: "uuid", order: -1)
    following: [Relationship!]                  @resolver(template: "shareable",     keyHere: "uuid", keyThere: "followerUuid", sort: "uuid")
    likes: [Like!]                              @resolver(template: "shareable",     keyHere: "uuid", keyThere: "authorUuid",   sort: "uuid", params: "{test1:true}")
  }

  type Query {
    getUser(query: JSON, params: JSON, key: JSON): User   @resolver(template: "feathers-get",  schema: "User", sort: "uuid", order: -1)
    findUser(query: JSON, params: JSON): [User!]          @resolver(template: "feathers-find", schema: "User", sort: "uuid", params: "{test2:true}")
  }
`;
