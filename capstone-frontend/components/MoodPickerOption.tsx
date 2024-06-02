import { router } from 'expo-router';
import { YStack, Text, Circle, CircleProps, useTheme } from 'tamagui';

interface MoodPickerOption extends CircleProps {}

export default function MoodPickerOption({ bg, children }: MoodPickerOption) {
  const theme = useTheme();

  const onPressHandler = () => {
    router.push('/scenario');
  };

  return (
    <YStack alignItems="center" gap={'$2'}>
      <Circle size={'$4'} bg={bg} onPress={onPressHandler}></Circle>
      <Text color={bg || theme.color} fontSize={'$1'} fow={100}>
        {children}
      </Text>
    </YStack>
  );
}
