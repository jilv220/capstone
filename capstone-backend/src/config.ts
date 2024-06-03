class Conf {
  static get port() {
    return parseInt(Bun.env.PORT ?? "4036");
  }
  static get envType() {
    return process.env.NODE_ENV ?? "development";
  }
  static get databaseUrl() {
    return Bun.env.DATABASE_URL ??
      "postgres://postgres:postgres@localhost:5432/postgres";
  }
  static get googleOAuth() {
    return {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectURI: process.env.GOOGLE_REDIRECT_URI!,
    };
  }
}

export { Conf };
