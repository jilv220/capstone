import { GoogleSignInBtn } from '@/components/GoogleSignInBtn';
import { useAuth } from '@/contexts/auth';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, ScrollView } from 'tamagui';

export default function SignIn() {
  return (
    <ScrollView px={'$4'} py={'$7'}>
      <Button
        onPress={() => {
          router.replace('/(tabs)');
        }}
      >
        Log In
      </Button>
      <GoogleSignInBtn />
    </ScrollView>
  );
}
