import { ListItem, ScrollView, Separator, SizableText, YGroup } from 'tamagui';
import { LogOut, FolderHeart, SunMoon } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/auth';
import ColorModeDialog from '@/components/ColorModeDialog';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResourcesScreen() {
  const { signOut } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView px={'$4'} pt={'$4'}>
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
          <Separator />
          <YGroup.Item>
            <ColorModeDialog>
              <ListItem icon={SunMoon}>Color Mode</ListItem>
            </ColorModeDialog>
          </YGroup.Item>
        </YGroup>
        <YGroup>
          <YGroup.Item>
            <ListItem
              icon={LogOut}
              onPress={async () => {
                await signOut();
              }}
            >
              Log out
            </ListItem>
          </YGroup.Item>
        </YGroup>
      </ScrollView>
    </SafeAreaView>
  );
}
