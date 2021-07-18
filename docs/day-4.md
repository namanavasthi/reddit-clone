# DAY 4

## CREATE AND REGISTER A USER

- create a new `user` entity
- new we'd need to create a new table for these users
- for this create a new script for migrations
- create resolver for `user`
- save passwords using `node-argon2`
- import user resolver to schema
- on localhost graphql run the `register()` call and create a user in the `User` database
- not i was not able to get the `password` of the user
- this is cause of the missing `Field()` in the schema

## CREATE A LOGIN

- create `login()` graphql query
- difference between `ObjectType` and `InputType` is that `ObjectType` is used for return type
- create fail checks
- run query on graphql
- update conditions for register to use `UserResponse` type
