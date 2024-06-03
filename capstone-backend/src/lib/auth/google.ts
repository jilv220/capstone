import { db } from "@/db/db.ts";
import { lucia } from "@/db/lucia.ts";
import { google } from "@/oauth.ts";
import { User } from "kysely-codegen";
import { generateId } from "lucia";

export const createGoogleSession = async ({
  idToken,
  codeVerifier,
  sessionToken,
}: {
  idToken: string;
  codeVerifier: string;
  sessionToken?: string;
}) => {
  const tokens = await google.validateAuthorizationCode(idToken, codeVerifier);
  const response = await fetch(
    "https://openidconnect.googleapis.com/v1/userinfo",
    {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    },
  );
  const user: {
    sub: string;
    name: string;
    email: string;
    email_verified: boolean;
    picture: string;
  } = await response.json();

  const existingAccount = await db
    .selectFrom("ouath_account")
    .selectAll()
    .where("provider_user_id", "=", user.sub.toString())
    .executeTakeFirst();

  let existingUser: User | undefined = undefined;
  if (!sessionToken) {
    existingUser = await db
      .selectFrom("user")
      .selectAll()
      .where("user.email", "=", user.email)
      .executeTakeFirst();
  } else {
    const { user } = await lucia.validateSession(sessionToken);
    if (user) existingUser = user;
  }

  if (existingAccount && existingUser) {
    const session = await lucia.createSession(existingUser.id, {});
    return session;
  }

  // No need to link existing user with their OAuth Identity, since only OAuth is provided
  const userId = generateId(15);
  let username = user.name;
  await db
    .transaction()
    .execute(async (tx) => {
      await tx
        .insertInto("user")
        .values({
          id: userId,
          username,
          email: user.email,
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      return await tx
        .insertInto("ouath_account")
        .values({
          provider_user_id: user.sub,
          provider_id: "google",
          user_id: userId,
        })
        .execute();
    });

  const session = await lucia.createSession(userId, {});
  return session;
};
