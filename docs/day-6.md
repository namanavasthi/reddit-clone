# DAY 6

- moved the next-js app inside `reddit-clone` git
- moved all the server code under a new folder called `server`
- new dir structure

```
- root
-- server
-- web
```

- this is commit `day-6:1`

## SETUP GRAPHQL ON NEXT.JS

- for nextjs to talk with our server graphql
- we use `urql`
- now we gotta be careful where we add the `Provider` defined by `urql` as we'd need some of our pages to be server side rendered
- for starters lets get things working at `_app.tsx`
- now inside `register.tsx` add the urql hook
- if fetch options is `include` which it should be, then a CORS error will occur
- solution, head over to apollo middleware and set cors origin as `http://localhost:3000` instead of the default value of `*`
- this will only add CORS resolution for this particular path, but we'd prefer a more generic solution
- for that `npm add cors` and add the type `npm i -D @types/cors`
- turn the cors origin in apollo middleware to `false`
- add cors to express app and don't worry about whats on apollo

## DEAL WITH URQL AND THE RESPONSE FROM SERVER

- the response coming into `urql` is of type `any` 😔
- to fix this, we'd use a library called `graphql code generator`
- what it does is,
  - look at our queries
  - generate typescript types for us
  - and generate urql hooks
- `npm i -D @graphql-codegen/cli`
- `npx graphql-codegen init`
- remove apollo lines from `codegen.yml` and `package.json` dev dependencies
- instead use `typescript-urql` plugin
- create `graphql/mutations/register.graphql`
- run `npm run gen` -> this will generate `generated/graphql.tsx`
- this is information needed for type safe queries
- it will also add a react hook for us to use in code
- go back to `register.tsx` and remove the `const REGISTER_MUTATION` and instead use the hook generated

> NOTE : WORKFLOW
> every time we want to add a mutation or a query
> go to the `graphql` folder, add the query or mutation
> run `npm run gen`, which will generate the react hook
> use the generated hook in frontend code
> PS: name of the hook is based of the name of the mutation or query being added inside the files

## WORK ON SUBMIT LOGIC FOR REGISTER

- handle errors
- write util to convert error array into error object
- on success, navigate to landing page
