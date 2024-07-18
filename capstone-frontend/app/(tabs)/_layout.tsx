import { StyleSheet } from 'react-native';
import { Redirect, Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useTheme, Text, YStack, Spinner } from 'tamagui';
import { useAuth } from '@/contexts/auth';
import { Modal, View } from 'react-native';
import { TouchableOpacity } from 'react-native';

import AddButton from '@/components/navigation/AddButton';
import MoodSelect from '@/components/MoodSelect';
import * as SystemUI from 'expo-system-ui';

export default function TabLayout() {
  const theme = useTheme();
  const { user, loading } = useAuth();
  const [moodSelect, showMoodSelect] = useState(false);
  // Fix ScreenSplash background
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.background.val);
  }, []);

  if (loading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center">
        <Spinner size="large" color={'$orange10'} />
      </YStack>
    );
  }

  if (!user) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <GestureHandlerRootView>
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
              <TabBarIcon
                name={focused ? 'document-text' : 'document-text-outline'}
                color={color}
              />
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
            tabBarButton: () => (
              <AddButton
                handleClick={() => {
                  showMoodSelect(!moodSelect);
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
      {/* -- Add MoodSelect modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={moodSelect}
        onRequestClose={() => {
          showMoodSelect(false);
        }}
      >
        <TouchableOpacity
          onPress={() => {
            showMoodSelect(false);
          }}
        >
          <View style={styles.modalOverlay}>
            <View>
              <TouchableOpacity onPress={() => {}}>
                <MoodSelect
                  handleClose={() => {
                    showMoodSelect(false);
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
});
