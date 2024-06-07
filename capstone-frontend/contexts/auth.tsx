import * as Browser from 'expo-web-browser';

import React, { useEffect, useState } from 'react';
import Storage from '@/lib/storage.native';
import { getUser } from '@/actions/user';
import { AuthActions } from '@/actions/auth';
import { IdTokenOptions, Provider } from '@/actions';
import { makeRedirectUri } from 'expo-auth-session';
import KySingleton from '@/lib/kySingleton';
import { Conf } from '@/config';
import * as Linking from 'expo-linking';

type TAuthContext = {
  user: any;
  signOut: () => Promise<void>;
  signInWithIdToken: (args: IdTokenOptions) => Promise<any>;
  signInWithOAuth: (args: { provider: Provider; redirect?: string }) => Promise<any>;
  loading: boolean;
};
type MaybeTAuthContext = TAuthContext | undefined;

const AuthContext = React.createContext<MaybeTAuthContext>(undefined);

// This hook can be used to access the user info.
export function useAuth() {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

Browser.maybeCompleteAuthSession();
export function AuthProvider(props: React.PropsWithChildren) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const signInWithOAuth: TAuthContext['signInWithOAuth'] = async ({
    provider,
    redirect = makeRedirectUri(),
  }) => {
    const oauthUrl = new URL(`${Conf.apiUrl}/api/v1/sign-in/${provider}?redirect=${redirect}`);
    const sesionToken = await Storage.getItem('session_token');
    if (sesionToken) {
      oauthUrl.searchParams.append('sessionToken', sesionToken);
    }

    const result = await Browser.openAuthSessionAsync(oauthUrl.toString(), redirect);
    if (result.type !== 'success') {
      return null;
    }

    const url = Linking.parse(result.url);
    const sessionToken = url.queryParams?.token?.toString() ?? null;
    if (!sessionToken) return null;
    KySingleton.addAuthorizationHeader(sessionToken);

    const user = await getUser();
    setUser(user);
    await Storage.setItem('session_token', sessionToken);

    return user;
  };

  const signInWithIdToken = async ({ idToken, provider }: IdTokenOptions) => {
    const sessionToken = await AuthActions.signInWithIdToken({ idToken, provider });
    if (!sessionToken) return null;
    KySingleton.addAuthorizationHeader(sessionToken);

    const user = await getUser();
    setUser(user);
    await Storage.setItem('session_token', sessionToken);

    return user;
  };

  const signOut = async () => {
    const res = await AuthActions.signOut();
    if (!res.ok) return;

    setUser(null);
    KySingleton.clearAuthorizationHeader();
    await Storage.deleteItem('session_token');
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const sessionToken = await Storage.getItem('session_token');
      if (sessionToken) {
        KySingleton.addAuthorizationHeader(sessionToken);
        const user = await getUser();
        setUser(user);
      }
      setLoading(false);
    };

    init();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signOut, loading, signInWithOAuth, signInWithIdToken }}>
      {props.children}
    </AuthContext.Provider>
  );
}
