import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useFonts } from 'expo-font';
import { TamaguiProvider, Theme, useTheme } from 'tamagui';
import { useEffect } from 'react';
import { AuthProvider } from '@/contexts/auth';
import tamaguiConfig from '@/tamagui.config';
import { useUserStore } from '@/stores/userStore';

export default function RootLayout() {
  // This is from Native
  const colorScheme = useColorScheme();

  const theme = useUserStore((state) => state.theme);
  const initTheme = useUserStore((state) => state.initTheme);

  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      initTheme(colorScheme);
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <Theme name={colorScheme}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AuthProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="sign-in" options={{ headerShown: false }} />
              <Stack.Screen name="scenario" options={{ headerShown: false }} />
              <Stack.Screen name="resources" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </AuthProvider>
        </ThemeProvider>
      </Theme>
    </TamaguiProvider>
  );
}
