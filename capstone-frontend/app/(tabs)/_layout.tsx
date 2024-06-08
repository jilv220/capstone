import * as SystemUI from 'expo-system-ui';
import { Alert, StyleSheet } from 'react-native';
import { Redirect, Tabs, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useTheme, Text } from 'tamagui';
import { useAuth } from '@/contexts/auth';
import AddButton from '@/components/navigation/AddButton';
import { NavigationContainer } from '@react-navigation/native';
import { Modal, View } from 'react-native';
import MoodSelect from '@/components/MoodSelect';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
export default function TabLayout() {
  const theme = useTheme();
  const { user, loading } = useAuth();
  const [moodSelect, showMoodSelect] = useState(false);
  const [editRecord, showEditRecord] = useState(false);
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
            <View style={styles.inner}>
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

      {/* -- Add Edit Modal */}
      <Modal animationType="fade" transparent={true} visible={editRecord}></Modal>
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
  inner: {
    paddingHorizontal: 20,
  },
});
