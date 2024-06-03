import { Kysely, PostgresDialect } from "kysely";
import { NodePostgresAdapter } from "@lucia-auth/adapter-postgresql";
import { Pool } from "pg";
import { Conf } from "../config.ts";
import { DB } from "kysely-codegen";

const pool = new Pool({ connectionString: Conf.databaseUrl });
export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool,
  }),
});

export const adapter = new NodePostgresAdapter(pool, {
  user: "user",
  session: "session",
});
