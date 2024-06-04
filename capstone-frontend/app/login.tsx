import { useSession } from '@/context/auth';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, ScrollView } from 'tamagui';

export default function SignIn() {
  const { signIn } = useSession();
  return (
    <ScrollView px={'$4'} py={'$7'}>
      <Button
        onPress={() => {
          signIn();
          router.replace('/(tabs)');
        }}
      >
        Log In
      </Button>
    </ScrollView>
  );
}
