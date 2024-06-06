import type { User } from 'kysely-codegen';
import { Lucia } from 'lucia';
import { Conf } from '../config.ts';
import { adapter } from './db.ts';

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: Conf.isProduction,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      username: attributes.username,
      email: attributes.email,
      avatar_url: attributes.avatar_url,
    };
  },
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: User;
  }
}
