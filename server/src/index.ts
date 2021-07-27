import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { COOKIE_NAME, __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import cors from "cors";

import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { AppContext } from "./types";

const main = async () => {
  /*
   * create db connection
   */
  const orm = await MikroORM.init(mikroConfig);
  const migrator = orm.getMigrator();
  await migrator.createMigration();
  await migrator.up();

  /*
   * setup express app
   */
  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  /*
   * setup cors config
   */

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redisClient, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // csrf protection
        secure: __prod__, // cookie only works in https
      },
      saveUninitialized: false,
      secret: "ysdfbvuwqwrkuyevfkuyvsufkygsd",
      resave: false,
    })
  );

  /*
   * create graphql endpooint using apollo
   */
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): AppContext => ({ em: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: false,
    },
  });

  app.listen(4000, () => {
    console.log("server started on localhoost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});
