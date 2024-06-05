import * as Browser from 'expo-web-browser';

import React, { useEffect, useState } from 'react';
import Storage from '@/lib/storage.native';
import { getUser } from '@/actions/user';
import { AuthActions } from '@/actions/auth';
import { IdTokenOptions } from '@/actions';
import KySingleton from '@/lib/kySingleton';

type TAuthContext = {
  user: any;
  signOut: () => Promise<void>;
  signInWithIdToken: (args: IdTokenOptions) => Promise<any>;
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

  const signInWithIdToken = async ({ idToken, provider }: IdTokenOptions) => {
    const sessionToken = await AuthActions.signInWithIdToken({ idToken, provider });
    if (!sessionToken) return null;

    const user = await getUser();
    setUser(user);

    await Storage.setItem('session_token', sessionToken);
    return user;
  };

  const signOut = async () => {
    const res = await AuthActions.signOut();
    if (!res.ok) return;

    setUser(null);
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
    <AuthContext.Provider value={{ user, signOut, loading, signInWithIdToken }}>
      {props.children}
    </AuthContext.Provider>
  );
}
