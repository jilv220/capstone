import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createTable("user")
    .addColumn("id", "text", (col) => col.primaryKey())
    .execute();

  await db.schema.createTable("session")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("expires_at", "timestamptz", (col) => col.notNull())
    .addColumn(
      "user_id",
      "text",
      (col) => col.references("user.id").onDelete("cascade").notNull(),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("user").execute();
  await db.schema.dropTable("session").execute();
}
