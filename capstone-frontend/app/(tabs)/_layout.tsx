import * as SystemUI from 'expo-system-ui';

import { Redirect, Stack, Tabs, router } from 'expo-router';
import React, { useEffect } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useTheme, Text } from 'tamagui';
import { useAuth } from '@/contexts/auth';

export default function TabLayout() {
  const theme = useTheme();
  const { user, loading } = useAuth();

  // Fix ScreenSplash background
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.background.val);
  }, []);

  if (loading) {
    return (
      <>
        <Text>Loading...</Text>
        <Stack.Screen options={{ headerShown: false }} />
      </>
    );
  }

  if (!user) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.color.val,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Entries',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'document-text' : 'document-text-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'stats-chart' : 'stats-chart-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'chatbubbles' : 'chatbubbles-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'ellipsis-horizontal' : 'ellipsis-horizontal-outline'}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
