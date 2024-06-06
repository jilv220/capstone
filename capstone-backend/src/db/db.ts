import { NodePostgresAdapter } from '@lucia-auth/adapter-postgresql';
import { Kysely, PostgresDialect } from 'kysely';
import type { DB } from 'kysely-codegen';
import { Pool } from 'pg';
import { Conf } from '../config.ts';

const pool = new Pool({ connectionString: Conf.DATABASE_URL });
export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool,
  }),
});

export const adapter = new NodePostgresAdapter(pool, {
  user: 'user',
  session: 'session',
});
