import { db } from '@/db/db.ts';
import { lucia } from '@/db/lucia.ts';
import { google } from '@/oauth.ts';
import { UserRepository } from '@/repos/user.repo.ts';
import { AuthService } from '@/services/auth.ts';
import { User } from 'kysely-codegen';
import { generateId } from 'lucia';

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
  const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`,
    },
  });
  const user: {
    sub: string;
    name: string;
    email: string;
    email_verified: boolean;
    picture: string;
  } = await response.json();

  const existingAccount = await UserRepository.findOAuthAccount(user.sub.toString());

  let existingUser: User | undefined = undefined;
  if (!sessionToken) {
    existingUser = await UserRepository.findByEmail(user.email);
  } else {
    const { user } = await AuthService.validateSession(sessionToken);
    if (user) existingUser = user;
  }

  if (existingAccount && existingUser) {
    return AuthService.createSession(existingUser.id, {});
  }

  // No need to link existing user with their OAuth Identity, since only OAuth is provided
  const userId = generateId(15);
  let username = user.name;
  await db.transaction().execute(async (tx) => {
    await tx
      .insertInto('user')
      .values({
        id: userId,
        username,
        email: user.email,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return await tx
      .insertInto('ouath_account')
      .values({
        provider_user_id: user.sub,
        provider_id: 'google',
        user_id: userId,
      })
      .execute();
  });

  return AuthService.createSession(userId, {});
};
