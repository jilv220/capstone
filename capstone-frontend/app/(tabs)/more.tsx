import { Button, H1, H2, ListItem, ScrollView, Text, YGroup, YStack } from 'tamagui';
import { LogOut, FolderHeart } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { useSession } from '@/contexts/auth';

export default function ResourcesScreen() {
  const { signOut } = useSession();

  return (
    <ScrollView px={'$4'} py={'$7'}>
      <YGroup pb={'$3'}>
        <YGroup.Item>
          <ListItem
            icon={FolderHeart}
            onPress={() => {
              router.push('/resources');
            }}
          >
            Resources
          </ListItem>
        </YGroup.Item>
      </YGroup>
      <YGroup>
        <YGroup.Item>
          <ListItem
            icon={LogOut}
            onPress={() => {
              signOut();
            }}
          >
            Log out
          </ListItem>
        </YGroup.Item>
      </YGroup>
    </ScrollView>
  );
}
