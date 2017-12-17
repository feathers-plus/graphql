# @feathers-plus/graphql

[![Build Status](https://travis-ci.org/feathers-plus/graphql.png?branch=master)](https://travis-ci.org/feathers-plus/graphql)
[![Code Climate](https://codeclimate.com/github/feathers-plus/graphql/badges/gpa.svg)](https://codeclimate.com/github/feathers-plus/graphql)
[![Test Coverage](https://codeclimate.com/github/feathers-plus/graphql/badges/coverage.svg)](https://codeclimate.com/github/feathers-plus/graphql/coverage)
[![Dependency Status](https://img.shields.io/david/feathers-plus/graphql.svg?style=flat-square)](https://david-dm.org/feathers-plus/graphql)
[![Download Status](https://img.shields.io/npm/dm/graphql.svg?style=flat-square)](https://www.npmjs.com/package/graphql)

> A high performance GraphQL adapter for SQL and non-SQL databases.

## Installation

**For now you have to install the repo directly from GitHub, not from npm.**

```
npm install graphql --save
```

## Introduction

You should understand [why you would want to use GraphQL](https://reactjs.org/blog/2015/05/01/graphql-introduction.html)
and become [familiar with using it.](https://www.graphql.com/guides/)

@feathers-plus/graphql is designed for:
- The client specifies what deeply included data it needs.
- Retrieving that data very efficiently.
- Working with both SQL and non-SQL databases.
- Generating most of the code needed to support the database schemas, while allowing customization.

Using @feathers-plus/graphql with Feathers services can be **much** faster than using the populate common hook.
- Reads are batched, so if `user` records need to be read for different parts of the query --
perhaps in one place we need all the authors of multiple posts, while in another place we need all the authors of some commments --
just one `user.find({ query: { id: { $in: [...] } } })` is performed rather than a
`user.find({ query: { id: ... } })` for each author.
- Records are also cached, so a `user` record need not be reread.
- You can choose to persist some caches between queries, so reads are not required to prime them at the start of each query.
    - You can choose the maximum size appropriate for each cache to control memory pressure. The least-recently-used records are cleared.
    - A hook is provided for your Feathers services which clears keys from a cache when their records are mutated.

We can illustrate the performance improvement by counting the number of Feathers service reads the example's
[findUser query](./example/docs/find-user.md)
performs:
- Custom code (working very much like the populate common hook): **76 reads.**
- High performance, generated code, the first time it runs: **7 reads.**
- High performance, generated code, subsequent times it runs: **6 reads.**

**The performance improvement may be significant.**

Code is generated for both Feathers services and SQL statements,
driven by decorations which you add to the schema.
You can customize that code and your customizations will persist through subsequent code regenerations.
You will find these decorations are must easier and faster to write
than coding all the required GraphQL resolvers and SQL metadata yourself.

You can choose, when @feathers-plus/graphql is configured, whether Feathers services or SQL statements should be used.

## Working Example

**WIP**

See feathers-plus/xxxx

## License

Copyright (c) 2017

Licensed under the [MIT license](LICENSE).
