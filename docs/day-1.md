# DAY 1

## BASIC SETUP

- created git repo [here](https://github.com/namanavasthi/reddit-clone)
- initialize project using `npm init -y`
- at the time of creating this npm version is `7.19.1` and node version is `v14.15.3`
- now to setup type script `npm i -D typescript @types/node`
- setup tsconfig by `npx tsconfig.json` and select `node`
- add `.gitignore` file
- create `src/index.ts` and add some sample code in
- update `scripts` inside `package.json`
- install `nodemon` by `npm i -D nodemon`

## DATABASE SETUP

- install `npm i -s @mikro-orm/core @mikro-orm/migrations @mikro-orm/postgresql @mikro-orm/cli pg`
- `brew update` and then `brew install postgresql`
- `brew services start postgresql`
- `psql postgres`
- `CREATE ROLE root WITH LOGIN PASSWORD 'root';`
- `ALTER ROLE root CREATEDB;`
- `\q`
- `psql postgres -U root`
- `brew services stop postgresql` -> when done

[LINK FOR HELP](https://www.sqlshack.com/setting-up-a-postgresql-database-on-mac/)

- after this went ahead and installed [`postgres` gui](https://www.postgresql.org/download/macosx/)
- then `psql`
- `create database redditclone;`

## CREATE DB

- `createdb redditclone`
- update `index.ts`
- create `constants.ts`
- create [entities](https://mikro-orm.io/docs/defining-entities), using `Post.ts`
- update `package.json` as per the configuration provided [here](https://mikro-orm.io/docs/installation/#setting-up-the-commandline-tool)
- create `./src/mikro-orm.config.ts`

## SETUP MIGRATIONS

- refer [here](https://mikro-orm.io/docs/migrations/) for more details
- update `mikro-orm.config.ts` with new migrations object
- install `npm i -D ts-node`
- run `npx mikro-orm migration:create`

## RUN MIGRATION IN CODE

- update `index.ts` to now `getMigrator()`
