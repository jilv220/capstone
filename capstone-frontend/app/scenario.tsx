import ScenariosOptions from '@/components/ScenariosOptions';
import { useRoute } from '@react-navigation/native';
import { ChevronLeft, ChevronRight, X } from '@tamagui/lucide-icons';
import { router, useGlobalSearchParams, useLocalSearchParams, useRouter } from 'expo-router';
import { green } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
import { Button, ScrollView, SizableStack, SizableText, Text, XStack, YStack } from 'tamagui';

const ScenarioScreen: React.FC = () => {
  const router = useRouter();
  const { moodInScenario, dateInScenario } = useLocalSearchParams();

  console.log(moodInScenario, dateInScenario);

  return (
    <ScrollView px={'$4'} py={'$7'}>
      <XStack flex={1} justifyContent="space-between">
        <YStack>
          <Button
            icon={<ChevronLeft size={'$2'} color={'$grey'} />}
            onPress={() => {
              router.back();
            }}
          ></Button>
        </YStack>
        <YStack>
          <Button icon={<ChevronRight size={'$2'} color={'$grey'} />}></Button>
        </YStack>
      </XStack>

      <YStack alignItems="center">
        <SizableText fontWeight={'500'}>What have you been up to?</SizableText>
      </YStack>
      <YStack>
        <ScenariosOptions />
      </YStack>
    </ScrollView>
  );
};

export default ScenarioScreen;
