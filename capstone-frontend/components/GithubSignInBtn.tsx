import { SvgUri } from 'react-native-svg';
import { router } from 'expo-router';
import { Button, Image, useTheme } from 'tamagui';
import { useAuth } from '@/contexts/auth';
import { FontAwesome } from '@expo/vector-icons';

export const GithubSignInBtn = () => {
  const { signInWithOAuth } = useAuth();
  const theme = useTheme();

  return (
    <Button
      onPress={() => {
        void signInWithOAuth({ provider: 'github' }).then((user) => {
          if (user) {
            router.replace('/(tabs)');
          }
        });
      }}
      icon={<FontAwesome name="github" size={20} />}
    >
      Continue with GitHub
    </Button>
  );
};
