# @feathers-plus/graphql

> A high performance GraphQL adapter for SQL and non-SQL databases.

## Configuration

You can configure Feathers services using the @feathers-plus/graphql adapter as shown in the
[docs](https://generator.feathers-plus.com/).
The adapter can be configured to use either
- normal Feathers services,
- Feathers services with [BatchLoaders](https://feathers-plus.github.io/v1/batch-loader/), or
- raw SQL statements.

Press the appropriate `Show` button in the docs to see relevant code.

## Examples

As you can see from the sample code above,
the adapter requires multiple working parts in order to configure the GraphQL instance properly.
That's just how GraphQL is.

[@feathers-plus/cli-generate-example](https://github.com/feathers-plus/cli-generator-example)
contains 10 working examples of using the GraphQL adapter.
You should refer to them while reading the [docs](https://generator.feathers-plus.com/).

![example database schema](./docs/schema.jpg)

![example test harness](./doc/test-harness.jpg)

## Resolver Functions

GraphQL is a wrapper around [resolver functions](https://graphql.org/learn/execution/#root-fields-resolvers)
you have to provide.
You'll be familiar with resolvers if you've used the [fastJoin](https://feathers-plus.github.io/v1/feathers-hooks-common/guide.html#fastJoin)
common hook.

You will find that you need to write **lots and lots** of resolver functions for a non-trivial app.
For some insight, look at this
[relatively simple example](https://github.com/feathers-plus/cli-generator-example/blob/master/js-nedb-services/src/services/graphql/service.resolvers.js)
involving just 5 tables.

> Most of the effort in using GraphQL will be devoted to writing lots of resolver functions.

The above example uses normal Feathers service calls, without caching, without batching.
You would see an approximate ten-fold performance improvement is you used Feathers service calls
in conjunction with [BatchLoaders](https://feathers-plus.github.io/v1/batch-loader/).
These types of resolver functions would be
[more complicated.](https://github.com/feathers-plus/cli-generator-example/blob/master/js-nedb-services/src/services/graphql/batchloader.resolvers.js) 

Finally, you may consider resolver functions which produce raw SQL statements
if you are using an SQL database with Sequelize or Knex.
This may very well result in a performance improvement over BatchLoaders
but you would have to something like [join-monster](https://join-monster.readthedocs.io/en/latest/)
along with resolver functions.

## Generating Resolver Functions

[@feathers-plus/cli](https://generator.feathers-plus.com/), a.k.a. cli+, was written to automatically generate
the resolver functions for you.
You can customize the resulting resolver code as needed.

![example generate graphql](./docs/generate-graphql.png)

The examples in [@feathers-plus/cli-generate-example](https://github.com/feathers-plus/cli-generator-example)
were all written with cli+
and you can use cli+ to modify them.

## License

Copyright (c) 2018

Licensed under the [MIT license](LICENSE).
