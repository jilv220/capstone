import * as SystemUI from 'expo-system-ui';

import { Redirect, Tabs, router } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useTheme, Text } from 'tamagui';
import { useAuth } from '@/contexts/auth';
import AddButton from '@/components/navigation/AddButton';
export default function TabLayout() {
  const theme = useTheme();
  const { user, loading } = useAuth();
  const [moodselect, showMoodSelect] = useState(false);
  // Fix ScreenSplash background
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.background.val);
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!user) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'yellowgreen',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Entries',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'document-text' : 'document-text-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'stats-chart' : 'stats-chart-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="addScreen"
        options={{
          title: 'Add',
          headerShown: false,
          tabBarIcon: () => (
            <AddButton
              handleClick={() => {
                showMoodSelect(!moodselect);
              }}
            />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          headerShown: false,
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
