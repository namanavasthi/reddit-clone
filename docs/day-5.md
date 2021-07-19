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

### WHAT IS GOING ON HERE

#### STORE IN REDIS

- whatever i put inside `req.session.<something>` gets stored into redis like
- `{<something> : value}` this is the data being stored into redis
- but redis will store them as `<key, value>` pairs

#### SIGN THE KEY

- `express-session` will get this `key` from redis
- sign it, and store it as the cookie value on user's browser

#### MAKE A REQUEST

- whenever the user makes a request, the cookie value stored is sent to the server
- on the server, it decrypt the cookie value using the `secret` we define in the session's property
- this will give the server the `key` from the redis db it would wanna check
- make a request to redis, look up the `key` and get the data

> NOTE : it's now important to realize why we stored the ID and not any other field
> we'd want this session value to be static and not change

## FRONTEND WITH NEXT + CHAKRA UI

- `npx create-next-app --example with-chakra-ui reddit-clone-web`
- will be documenting web related stuff inside `reddit-clone-web`
