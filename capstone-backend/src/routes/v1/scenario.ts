import { db } from '@/db/db.ts';
import { Hono } from 'hono';
import * as R from 'remeda';

const scenario = new Hono().basePath('/scenario');

scenario.get('/', async (c) => {
  const scenarios = await db.selectFrom('scenario').select(['category', 'detail']).execute();

  const values = R.map(scenarios, (sc) => R.values(sc));
  const res = R.reduce(
    values,
    (obj, tp) => {
      return R.pipe(
        obj[tp[0]],
        R.conditional(
          [R.isArray, (arr) => R.addProp(obj, tp[0], R.concat(arr, [tp[1]]))],
          [R.isNullish, () => R.addProp(obj, tp[0], [])]
        )
      );
    },
    Object.create({})
  );

  return c.json(res, 200);
});

export default scenario;
