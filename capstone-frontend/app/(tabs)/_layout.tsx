import * as SystemUI from 'expo-system-ui';

import { Redirect, Tabs, router } from 'expo-router';
import React, { useEffect } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useTheme, Text } from 'tamagui';
import { useSession } from '@/context/auth';

export default function TabLayout() {
  const theme = useTheme();
  const { session, isLoading } = useSession();

  // Fix ScreenSplash background
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.background.val);
  }, []);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/login" />;
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
