import { Conf } from '@/config.ts';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import { z } from 'zod';

import { NotFoundError } from '@/interfaces/error.ts';
import { ResourceRepository } from '@/repos/resource.ts';
import { ResourceService } from '@/services/resource.ts';
import { serverError } from '@/utils/hono.ts';
import { DatabaseError } from 'pg';
import article from './article/index.ts';

const resource = new Hono().basePath('/resource');

// GET is public
// The rest is behind healthlink auth
const bearerAuthMiddleware = bearerAuth({ token: Conf.HEALTH_LINK_SECRET });
resource.post('/*', bearerAuthMiddleware);
resource.patch('/*', bearerAuthMiddleware);
resource.delete('/*', bearerAuthMiddleware);

resource.route('/', article);

resource.get('/', async (c) => {
  const { phoneNumbers, articles } = await ResourceService.mapToObj();
  return c.json({
    phone_numbers: phoneNumbers,
    articles,
  });
});

resource.get(
  '/:resourceName',
  zValidator(
    'param',
    z.object({
      resourceName: z.string(),
    })
  ),
  async (c) => {
    const resourceName = c.req.valid('param').resourceName;

    try {
      const { phoneNumbers, articles } = await ResourceService.mapToObj(resourceName);
      return c.json({
        phone_numbers: phoneNumbers,
        articles,
      });
    } catch (e) {
      if (e instanceof NotFoundError) {
        return c.notFound();
      }
      return serverError(c);
    }
  }
);

resource.post(
  '/',
  zValidator(
    'json',
    z.object({
      resource_name: z.string(),
    })
  ),
  async (c) => {
    const resourceName = c.req.valid('json').resource_name;
    try {
      const res = await ResourceRepository.createOne({
        name: resourceName,
      });
      return c.json(res);
    } catch (e) {
      if (e instanceof DatabaseError) {
        switch (e.code) {
          case '23505':
            return c.newResponse('Entry with this resource name already exists', 409);
          default:
            console.error(e);
            return c.newResponse('Unknown database error', 500);
        }
      }
      return serverError(c);
    }
  }
);

export default resource;
