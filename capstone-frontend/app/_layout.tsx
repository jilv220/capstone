import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { Animated, useColorScheme } from 'react-native';
import { useFonts } from 'expo-font';
import { PortalProvider, TamaguiProvider, Theme, useTheme } from 'tamagui';
import { useEffect } from 'react';
import { AuthProvider } from '@/contexts/auth';
import tamaguiConfig from '@/tamagui.config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useColorMode } from '@/hooks/useColorMode';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import { Conf } from '@/config';
import { InstantSearch } from 'react-instantsearch-core';

const queryClient = new QueryClient();
const { searchClient } = instantMeiliSearch(Conf.meiliHostUrl, Conf.meiliSearchApikey);

export default function RootLayout() {
  // This is from Native
  const colorScheme = useColorScheme();
  useColorMode();

  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <PortalProvider shouldAddRootHost>
      <TamaguiProvider config={tamaguiConfig}>
        <Theme name={colorScheme}>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <AuthProvider>
              <QueryClientProvider client={queryClient}>
                <InstantSearch searchClient={searchClient} indexName="resource_article">
                  <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="sign-in" options={{ headerShown: false }} />
                    <Stack.Screen name="scenario" options={{ headerShown: false }} />
                    <Stack.Screen name="resources" options={{ headerShown: false }} />
                    <Stack.Screen name="fullnote" options={{ headerShown: false }} />
                    <Stack.Screen name="+not-found" />
                  </Stack>
                </InstantSearch>
              </QueryClientProvider>
            </AuthProvider>
          </ThemeProvider>
        </Theme>
      </TamaguiProvider>
    </PortalProvider>
  );
}
