import { Pool } from "pg";
import { promises as fs } from "fs";
import path from "path";

import {
  FileMigrationProvider,
  Kysely,
  Migrator,
  PostgresDialect,
} from "kysely";
import { Conf } from "../src/config.ts";

async function migrateToLatest() {
  const pool = new Pool({ connectionString: Conf.databaseUrl });
  const db = new Kysely({
    dialect: new PostgresDialect({
      pool,
    }),
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: path.join(__dirname, "../src/db/migrations"),
    }),
  });

  console.info("Running migrations...");
  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error("failed to migrate");
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

migrateToLatest();
