# DAY 5

## FIX TO REGISTER USER

- re-insert same user throws error
- create a check on error code returned by `graphql`

## PERSIS THE USER

- store cookie in user's browser
- maintain a session for the user, `express-session` library for this
- express-session would want to store the user data and this would be done on an `in-memory` db called `Redis`
- note: express-session allows for any other db, not only redis
- why redis ?
  - its fast
  - it will be able to get user data very quickly,
  - cause on every request the user would be checked if he's logged in

### INSTALL REDIS

- follow instructions [here](https://redis.io/topics/quickstart)
- install `npm i redis connect-redis express-session`

- setup `connect-redis`
- make sure we load redis middleware before the apollo middleware
- this is because we'd be using session middleware inside apollo
- add req and res to apollo server, `req` is where we can access `sessions` from
- now we can access req (in turn session) inside user resolver
- add more properties to session object by [declaration merging](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/express-session/index.d.ts#L23)
- start redis server using `redis-server <location to redis config>` right now its in my downloads folder
- run login from graphql and inspect to see a cookie is being set

  > NOTE: make sure `request.credentials` is set to `include` when you hit settings on graphql localhost UI

- what have we done here ? now that we sare storing cookies on browser, when we send a req to the server, now the server know who we are
- head over to `userResolver` and add a `me` query
- now auto login people after they register
