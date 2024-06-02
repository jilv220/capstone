import MoodPickerOption from '@/components/MoodPickerOption';
import { Avatar, Button, Card, Circle, ScrollView, Text, XStack, YStack } from 'tamagui';

export default function HomeScreen() {
  return (
    <ScrollView px={'$4'} py={'$7'}>
      <Card elevate size={'$4'} bordered bg={'$black5'}>
        <Card.Header padded alignSelf="center" pb={'$1'}>
          <Text fow={700}>How are you?</Text>
        </Card.Header>
        <XStack px={'$4'} justifyContent="space-between" py={'$3'}>
          <MoodPickerOption bg={'$green9Light'}>rad</MoodPickerOption>
          <MoodPickerOption bg={'limegreen'}>good</MoodPickerOption>
          <MoodPickerOption bg={'yellow'}>meh</MoodPickerOption>
          <MoodPickerOption bg={'orange'}>bad</MoodPickerOption>
          <MoodPickerOption bg={'red'}>awful</MoodPickerOption>
        </XStack>
      </Card>
    </ScrollView>
  );
}
