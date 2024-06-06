import { Conf } from '@/config.ts';
import { lucia } from '@/db/lucia.ts';
import { UserRepository } from '@/repos/user.repo.ts';
import { AuthProvider } from '@/schemas/login.ts';
import { GitHub, Google } from 'arctic';
import { User } from 'kysely-codegen';
import { RegisteredDatabaseSessionAttributes, generateId } from 'lucia';

export class AuthService {
  public github: GitHub;
  public google: Google;

  constructor() {
    const googleOAuth = Conf.googleOAuth;
    this.google = new Google(
      googleOAuth.clientId,
      googleOAuth.clientSecret,
      googleOAuth.redirectURI
    );

    const githubOAuth = Conf.githubOAuth;
    this.github = new GitHub(githubOAuth.clientId, githubOAuth.clientSecret);
  }

  async validateSession(sessionToken: string) {
    return await lucia.validateSession(sessionToken);
  }

  async createSession(userId: string, attributes: RegisteredDatabaseSessionAttributes) {
    return await lucia.createSession(userId, attributes);
  }

  async validateAuthorizationCode(code: string, authProvider: AuthProvider, codeVerifier?: string) {
    if (authProvider === 'google') {
      return this.google.validateAuthorizationCode(code, codeVerifier!);
    }

    return this[authProvider].validateAuthorizationCode(code);
  }

  async createGoogleSession({
    idToken,
    codeVerifier,
    sessionToken,
  }: {
    idToken: string;
    codeVerifier: string;
    sessionToken?: string;
  }) {
    const tokens = await this.validateAuthorizationCode(idToken, 'google', codeVerifier);

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
      existingUser = await UserRepository.findBy({ email: user.email });
    } else {
      const { user } = await lucia.validateSession(sessionToken);
      if (user) existingUser = user;
    }

    if (existingAccount && existingUser) {
      return lucia.createSession(existingUser.id, {});
    }

    // No need to link existing user with their OAuth Identity, since only OAuth is provided
    const userId = generateId(15);
    let username = user.name;
    await UserRepository.createWithOAuth(
      {
        id: userId,
        username,
        email: user.email,
        avatar_url: user.picture,
      },
      {
        provider_user_id: user.sub,
        provider_id: 'google',
        user_id: userId,
      }
    );

    return this.createSession(userId, {});
  }
}
