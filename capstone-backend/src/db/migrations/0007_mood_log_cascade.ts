import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('mood_log_scenario')
    .dropConstraint('mood_log_scenario_mood_log_id_fkey')
    .execute();

  await db.schema
    .alterTable('mood_log_scenario')
    .addForeignKeyConstraint('mood_log_scenario_mood_log_id_fkey', ['mood_log_id'], 'mood_log', [
      'id',
    ])
    .onDelete('cascade')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('mood_log_scenario')
    .dropConstraint('mood_log_scenario_mood_log_id_fkey')
    .execute();

  await db.schema
    .alterTable('mood_log_scenario')
    .addForeignKeyConstraint('mood_log_scenario_mood_log_id_fkey', ['mood_log_id'], 'mood_log', [
      'id',
    ])
    .execute();
}
