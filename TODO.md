
- Add to service Queries
    - alwaysFetch: fields to always return for a schema.
    - deps: fields to also fetch when a field is specified. useful for calculated fields
    
- Dataloaders
    NO - serializeRecordKey & serializeDataLoaderKey should use feathers-plus-common/object/sortKeys
    NO   --> Let user handle this as we think object keys will be rarely used.

- services
    - metadata to allow paths such as `a-b/c`.
    - allow paths that are not valid JS names

- join-monster
    - seems to have a bug. see test for findUsers. Something returns null instead of [].
   
- Register pluggable middleware functions, like in Express, to run before and after GraphQL resolvers. Auth, permissions, filters, etc.
    - https://github.com/alekbarszczewski/graphql-add-middleware
    - https://github.com/kkemple/graphql-resolver-middleware
    - eddyystop/graphql-resolvers-middleware & eddyystop/graphql-resolvers-common