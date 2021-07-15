import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import mikroConfig from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);

  console.log("---------------- ORM INITIALIZED");

  const migrator = orm.getMigrator();

  console.log("---------------- MIGRATOR OBJECT INITIALIZED");

  await migrator.createMigration();

  console.log("---------------- CREATE MIGRATION");

  await migrator.up();

  console.log("---------------- RUN MIGRATION");

  const post = orm.em.create(Post, { title: "my first post" });

  console.log("---------------- INITIALIZE POST");

  await orm.em.persistAndFlush(post);

  console.log("---------------- PERSIST AND FLUSH POST INTO TABLE");

  const posts = await orm.em.find(Post, {});
  console.log(posts);
};

main().catch((err) => {
  console.error(err);
});
