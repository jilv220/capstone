import { type Kysely, sql } from 'kysely';
import { MoodLogScenario } from 'kysely-codegen';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('scenario').dropConstraint('category_detail_unique').execute();
  await db.schema.alterTable('scenario').dropColumn('detail').execute();
  await db.schema.alterTable('scenario').renameColumn('category', 'name').execute();

  await db.schema
    .alterTable('mood_log_scenario')
    .dropConstraint('mood_log_scenario_scenario_id_fkey')
    .ifExists()
    .execute();

  // Remove duplicate rows before changing schema
  await db
    .deleteFrom('scenario as a')
    .using('scenario as b')
    .where((eb) => eb.and([eb('a.id', '<', eb.ref('b.id')), eb('a.name', '=', eb.ref('b.name'))]))
    .returningAll()
    .execute();

  // Delete invalid mood log scenario
  await db
    .deleteFrom('mood_log_scenario')
    .where(
      'scenario_id',
      'in',
      db
        .selectFrom('mood_log_scenario')
        .leftJoin('scenario', 'scenario.id', 'mood_log_scenario.scenario_id')
        .select('mood_log_scenario.scenario_id')
        .where('scenario.id', 'is', null)
    )
    .execute();

  // Restore FK constraint
  await db.schema
    .alterTable('mood_log_scenario')
    .addForeignKeyConstraint('mood_log_scenario_scenario_id_fkey', ['scenario_id'], 'scenario', [
      'id',
    ])
    .execute();

  await db.schema.alterTable('scenario').addUniqueConstraint('name_unique', ['name']).execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('scenario').dropConstraint('name_unique').execute();
  await db.schema.alterTable('scenario').renameColumn('name', 'category').execute();
  await db.schema.alterTable('scenario').addColumn('detail', 'text').execute();

  await db.schema
    .alterTable('scenario')
    .addUniqueConstraint('category_detail_unique', ['category', 'detail'])
    .execute();
}
