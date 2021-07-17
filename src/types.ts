import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";

export type AppContext = {
  em: EntityManager<IDatabaseDriver<Connection>>;
};
