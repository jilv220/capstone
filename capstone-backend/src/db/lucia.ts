import { Lucia } from "lucia";
import { adapter } from "./db.ts";
import { Conf } from "../config.ts";
import { User } from "kysely-codegen";

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: Conf.envType === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      username: attributes.username,
      email: attributes.email,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: User;
  }
}
