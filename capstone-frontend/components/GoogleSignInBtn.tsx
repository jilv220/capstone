import { Conf } from '@/config';
import { useAuth } from '@/contexts/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { SvgUri } from 'react-native-svg';
import { Button } from 'tamagui';

GoogleSignin.configure({
  webClientId: Conf.googleWebClientId,
  offlineAccess: true,
});

export const GoogleSignInBtn = () => {
  const { signInWithIdToken } = useAuth();

  return (
    <Button
      onPress={async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();

          if (userInfo.serverAuthCode) {
            const user = await signInWithIdToken({
              idToken: userInfo.serverAuthCode,
              provider: 'google',
            });
            if (user) {
              router.replace('/(tabs)');
            }
          }
        } catch (error) {
          console.log(error);
        }
      }}
      icon={
        <SvgUri uri={'https://www.cdnlogo.com/logos/g/35/google-icon.svg'} width={20} height={20} />
      }
    >
      Continue with Google
    </Button>
  );
};
