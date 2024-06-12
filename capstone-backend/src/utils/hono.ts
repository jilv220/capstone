import type { Context } from 'hono';

export function serverError(c: Context) {
  return c.text('Internel Server Error', 500);
}
