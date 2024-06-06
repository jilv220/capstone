import { Conf } from '@/config.ts';
import { lucia } from '@/db/lucia.ts';
import { UserRepository } from '@/repos/user.repo.ts';
import type { AuthProvider } from '@/schemas/login.ts';
import { GitHub, Google } from 'arctic';
import { generateId } from 'lucia';

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

  async validateAuthorizationCode(code: string, authProvider: AuthProvider, codeVerifier?: string) {
    if (authProvider === 'google') {
      return this.google.validateAuthorizationCode(code, codeVerifier!);
    }

    return this[authProvider].validateAuthorizationCode(code);
  }

  async createGoogleSession(idToken: string, codeVerifier: string) {
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
    const existingUser = await UserRepository.findBy({ email: user.email });

    if (existingAccount && existingUser) {
      return lucia.createSession(existingUser.id, {});
    }
    if (existingUser && user.email_verified && !existingAccount) {
      await UserRepository.createOAuthAccount({
        provider_id: 'google',
        provider_user_id: user.sub.toString(),
        user_id: existingUser.id,
      });
      return lucia.createSession(existingUser.id, {});
    }

    const userId = generateId(15);
    const username = user.name;
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

    return lucia.createSession(userId, {});
  }

  async createGithubSession(idToken: string) {
    const tokens = await this.validateAuthorizationCode(idToken, 'github');
    const githubUserResponse = await fetch('https://api.github.com/user', {
      headers: {
        'User-Agent': 'hono',
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    const githubUserResult: {
      id: number;
      login: string; // username
      name: string;
      avatar_url: string;
    } = await githubUserResponse.json();

    const userEmailResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        'User-Agent': 'hono',
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    const userEmailResult: {
      email: string;
      primary: boolean;
      verified: boolean;
    }[] = await userEmailResponse.json();

    const primaryEmail = userEmailResult.find((email) => email.primary);
    if (!primaryEmail) return null;

    const existingAccount = await UserRepository.findOAuthAccount(githubUserResult.id.toString());
    const existingUser = await UserRepository.findBy({ email: primaryEmail.email });

    if (existingAccount && existingUser) {
      return lucia.createSession(existingUser.id, {});
    }
    if (existingUser && primaryEmail.verified && !existingAccount) {
      await UserRepository.createOAuthAccount({
        provider_id: 'github',
        provider_user_id: githubUserResult.id.toString(),
        user_id: existingUser.id,
      });
      return lucia.createSession(existingUser.id, {});
    }

    const userId = generateId(15);
    const username = githubUserResult.login;
    await UserRepository.createWithOAuth(
      {
        id: userId,
        username,
        email: primaryEmail.email,
        avatar_url: githubUserResult.avatar_url,
      },
      {
        provider_user_id: githubUserResult.id.toString(),
        provider_id: 'github',
        user_id: userId,
      }
    );

    return lucia.createSession(userId, {});
  }
}
