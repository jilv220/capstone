import KySingleton from '@/lib/kySingleton';
import { BASE_URL, IdTokenOptions } from '.';

const ky = KySingleton.getInstance();

export class AuthActions {
  static async signInWithIdToken({ idToken, provider }: IdTokenOptions) {
    const res = await ky.post(`sign-in/${provider}`, {
      json: { idToken },
    });
    if (!res.ok) {
      return null;
    }

    const sessionToken = (await res.json<{ token: string }>()).token;
    return sessionToken;
  }
  static async signOut() {
    return await ky.post(process.env.API_URL + `${BASE_URL}/sign-out`);
  }
}
