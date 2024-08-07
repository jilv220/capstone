class Conf {
  static get apiUrl() {
    return process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4036';
  }
  static get googleWebClientId() {
    return process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!;
  }
  static get googleIOSClientId() {
    return process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID!;
  }
  static get meiliHostUrl() {
    return process.env.EXPO_PUBLIC_MEILI_HOST_URL!;
  }
  static get meiliSearchApikey() {
    return process.env.EXPO_PUBLIC_MEILI_SEARCH_API_KEY!;
  }
}

export { Conf };
