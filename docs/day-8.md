# DAY 8

- add a logout link to nav
- important to note, now if you test this but deleting the cookie and refreshing the page and then login, it wont work as intended. this is cause of `urql` caching the `me` request
- but it will generate the cookie
- so if you refresh the page it gonna work as intended
- solution for this ? update the cache and set the user when you login and update the cache when we register

> NOTE : `urql` doesn't come with a normalized cache, it comes with a separate package called `Graphcache`

- `npm i @urql/exchange-graphcache`
- now in `_app.tsx` update the `exchanges` needed, this is for setup purposes
- now what we wanna do is `Custom Updates`
- now types for `cache.updateQuery` are pretty 💩 so we create our own `betterUpdateQuery`
- now we can delete cookie, and login
- thus, we are now updating our query after our mutation fires

> NOTE: this means, we call `me query` manually (through urql exhanges) after a `register or login` mutation fires, instead of getting this info from `urql` cache

## Creating a Fragment

- use case : you can see in all `graphql` we have (mutations and query), they all return the same 2 fields for the user. say we want this to be different for different queries/mutations, for that we create whats called a `fragment`.

## Logout Functionality

- make changes on backend for this
- add resolver
- head over to graphql webpage, and test it
- then come to frontend and deal with it
- after one logs out, update the cache

## SERVER SIDE RENDERING WITH GRAPHQL AND URQL

- `urql` has a neat utility to help us do this called `next-urql`
- `npm install --save next-urql react-is urql graphql`
- wrap components with `withURQLClient()` to render them optionally server side
- create post graphql
- fetch these posts on browser, this is du du, so we instead do ssr for them posts
-
