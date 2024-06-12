import { db } from '@/db/db.ts';
import { ScenarioService } from '@/services/scenarios.ts';
import { Hono } from 'hono';

const scenario = new Hono().basePath('/scenario');

scenario.get('/', async (c) => {
  const scenarios = await db.selectFrom('scenario').select(['name']).execute();
  return c.json(ScenarioService.pluckName(scenarios), 200);
});

export default scenario;
