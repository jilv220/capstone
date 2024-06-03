import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createTable("ouath_account")
    .addColumn("provider_id", "text", (col) => col.notNull())
    .addColumn("provider_user_id", "text", (col) => col.notNull())
    .addColumn("user_id", "text", (col) => col.references("user.id").notNull())
    .addPrimaryKeyConstraint("primary_key", ["provider_id", "provider_user_id"])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("oauth_account").execute();
}
