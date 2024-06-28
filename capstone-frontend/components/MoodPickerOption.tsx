import { YStack, Text, CircleProps, useTheme, Button } from 'tamagui';

interface MoodPickerOption extends CircleProps {
  onPressHandler?: () => void;
  Icon?: any;
  children?: string;
  bg?: string;
  IconColor?: string;
  IconSize?: string;
}

export default function MoodPickerOption({
  bg,
  children,
  onPressHandler,
  Icon,
  IconColor,
  IconSize,
}: MoodPickerOption) {
  const theme = useTheme();

  return (
    <YStack alignItems="center" gap={'$2'}>
      <Button
        size={'$4'}
        bg={bg}
        onPress={onPressHandler}
        disabled={onPressHandler === undefined}
        circular
        icon={Icon && <Icon size={IconSize || '$4'} color={IconColor || 'white'} />}
      ></Button>
      <Text color={bg || theme.color} fontSize={'$1'} fow={100}>
        {children}
      </Text>
    </YStack>
  );
}
