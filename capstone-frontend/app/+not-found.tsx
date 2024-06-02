import { Link, Stack } from 'expo-router';
import { H1, Text, YStack } from 'tamagui';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <YStack>
        <H1>This screen doesn't exist.</H1>
        <Link href="/">
          <Text>Go to home screen!</Text>
        </Link>
      </YStack>
    </>
  );
}
