import { Conf } from '@/config';
import { useAuth } from '@/contexts/auth';
import { FontAwesome } from '@expo/vector-icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { Button } from 'tamagui';

GoogleSignin.configure({
  webClientId: Conf.googleWebClientId,
  iosClientId: Conf.googleIOSClientId,
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
      icon={<FontAwesome name="google" size={20} />}
    >
      Continue with Google
    </Button>
  );
};
