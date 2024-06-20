import { SizableText, YStack, YStackProps } from 'tamagui';

type MoodCounterBadgeProp = {
  children: React.ReactNode;
} & YStackProps;

export default function MoodCounterBadge({ children, bg }: MoodCounterBadgeProp) {
  return (
    <YStack
      position="absolute"
      x={25}
      y={-5}
      borderRadius={999}
      bg={bg}
      width={20}
      height={20}
      ai={'center'}
      jc={'center'}
    >
      <SizableText color={'$background'}>{children}</SizableText>
    </YStack>
  );
}
