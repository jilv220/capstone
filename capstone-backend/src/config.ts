import { z } from 'zod';

class Conf {
  static get port() {
    return parseInt(process.env.PORT || '4036');
  }
  static get envType() {
    return process.env.NODE_ENV || 'development';
  }
  static get databaseUrl() {
    return process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres';
  }
  static get expoRedirectURI() {
    const nativeAppPackageName = z.string().parse(process.env.NATIVE_APP_PACKAGE_NAME);
    return `${nativeAppPackageName}://`;
  }
  static get googleOAuth() {
    return {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectURI: process.env.GOOGLE_REDIRECT_URI!,
    };
  }
  static get githubOAuth() {
    return {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    };
  }
}

export { Conf };
