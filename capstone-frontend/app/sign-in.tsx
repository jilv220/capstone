import { GithubSignInBtn } from '@/components/GithubSignInBtn';
import { GoogleSignInBtn } from '@/components/GoogleSignInBtn';
import { router } from 'expo-router';
import { Button, Card, ScrollView, SizableText, YStack } from 'tamagui';

export default function SignIn() {
  return (
    <YStack ai="center" jc="center" f={1}>
      <Card py={'$3'}>
        <Card.Header pb={'$2'}>
          <SizableText size={'$9'}>Sign In</SizableText>
          <SizableText size={'$3'} color={'$color10'}>
            continue with:
          </SizableText>
        </Card.Header>
        <Card.Footer padded fd={'column'} gap={'$3'}>
          <GoogleSignInBtn />
          <GithubSignInBtn />
        </Card.Footer>
      </Card>
    </YStack>
  );
}
