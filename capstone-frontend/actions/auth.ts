import ky from '@/lib/kySingleton';
import { BASE_URL, IdTokenOptions } from '.';

export class AuthActions {
  static async signInWithIdToken({ idToken, provider }: IdTokenOptions) {
    const res = await ky.getInstance().post(`sign-in/${provider}`, {
      json: { idToken },
    });
    if (!res.ok) {
      return null;
    }

    const sessionToken = (await res.json<{ token: string }>()).token;
    return sessionToken;
  }
  static async signOut() {
    return await ky.getInstance().post('sign-out');
  }
}
