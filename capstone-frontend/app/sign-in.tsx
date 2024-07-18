import { GithubSignInBtn } from '@/components/GithubSignInBtn';
import { GoogleSignInBtn } from '@/components/GoogleSignInBtn';
import { Appearance, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, ScrollView, SizableText, YStack } from 'tamagui';

export default function SignIn() {
  const colorMode = Appearance.getColorScheme();

  return (
    <ImageBackground
      source={
        colorMode === 'dark'
          ? require('../assets/images/bg-pink-dark.png')
          : require('../assets/images/bg-pink.png')
      }
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <YStack flex={1} ai="center" jc="center" mx={'$4'}>
          <Card py={'$3'} width={'100%'} minHeight={200}>
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
      </SafeAreaView>
    </ImageBackground>
  );
}
