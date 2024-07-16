import React from 'react';
import MoodPickerOption from '@/components/MoodPickerOption';

import { Button, Card, Popover, SizableText, XStack, YStack, useTheme } from 'tamagui';
import {
  PlusCircle,
  Edit3,
  Trash2,
  NotebookPen,
  Laugh,
  Smile,
  Meh,
  Angry,
  AlertCircle,
  Frown,
} from '@tamagui/lucide-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMoodLog } from '@/actions/user';
import { categories } from '@/interfaces/categories';
import { Scenario, Scenarios } from '@/interfaces/scenario';
import { Mood } from '@/interfaces/moodLog';
import { router } from 'expo-router';
import { moodToBgColor, moodToIcon } from '@/lib/mood';

interface MoodDisplayProps {
  mood: Mood;
  digitTime: string;
  scenarios: Scenarios;
  year: number;
  month: number;
  date: number;
  id: string;
  note: string;
  setSheetOpen: (value: boolean) => void;
  onEdit: (id: string) => void;
}
const MoodDisplay: React.FC<MoodDisplayProps> = ({
  mood,
  digitTime,
  scenarios,
  year,
  month,
  date,
  id,
  note,
  setSheetOpen,
  onEdit,
}) => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteMoodLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mood-log'] });
    },
  });
  const theme = useTheme();
  const getCategory = (category: Scenario) => {
    const categoryData = categories.find((item) => item.key === category);
    return categoryData;
  };

  return (
    <YStack px={'$4'} py={'$4'}>
      <XStack elevation={2} backgroundColor={theme.color2.val} borderRadius={4}>
        <YStack flex={1}>
          <Card size={'$4'} backgroundColor={theme.color2.val} padded>
            <Card.Header padded alignSelf="center" pb={'$1'}></Card.Header>
            <MoodPickerOption Icon={moodToIcon(mood)} bg={moodToBgColor(mood)}>
              {mood}
            </MoodPickerOption>
          </Card>
        </YStack>
        <YStack flex={2}>
          <XStack px={'$2'} py={'$4'}>
            <SizableText fontWeight={300} fontFamily={'$mono'}>
              {new Date(
                year,
                month,
                date,
                parseInt(digitTime.split(':')[0]),
                parseInt(digitTime.split(':')[1])
              ).toDateString()}
            </SizableText>
          </XStack>
          <XStack px={'$2'} marginTop={'$-2'}>
            <SizableText color={'yellowgreen'} fontWeight={700} fontSize={25}>
              {mood}
            </SizableText>
            <SizableText px={'$2'}>{digitTime}</SizableText>
          </XStack>
          <XStack flexWrap="wrap" mt={'$2'}>
            {scenarios.map((scenario: Scenario) => {
              const category = getCategory(scenario);
              return (
                <XStack key={category?.key} ai={'center'}>
                  <YStack>
                    <Button
                      icon={category?.icon}
                      size={'$2'}
                      backgroundColor={'$white0'}
                      color={'yellowgreen'}
                    />
                  </YStack>
                  <YStack>
                    <SizableText fontSize={'$1'}>{category?.text}</SizableText>
                  </YStack>
                </XStack>
              );
            })}
          </XStack>
          {note && (
            <XStack>
              <SizableText color={theme.color11} px={'$2'} py={'$2'} fontSize={'$1'}>
                {note}
              </SizableText>
            </XStack>
          )}
        </YStack>
        <YStack flex={1}>
          <Popover size={'$8'} allowFlip placement="bottom">
            <Popover.Trigger asChild>
              <Button
                icon={PlusCircle}
                backgroundColor={theme.color2.val}
                size={'$7'}
                justifyContent="center"
              ></Button>
            </Popover.Trigger>
            <Popover.Content
              size={'$8'}
              flex={1}
              borderColor="$gray10Light"
              borderWidth={1}
              padding={0}
              elevate
              borderRadius={0}
              enterStyle={{ y: -10, opacity: 0 }}
              exitStyle={{ y: -10, opacity: 0 }}
              animation={[
                'quick',
                {
                  opactiy: {
                    overshoot: {
                      overshootClamping: true,
                    },
                  },
                },
              ]}
            >
              <YStack flex={1}>
                <Popover.Close asChild fd={'row'}>
                  <Button
                    icon={Edit3}
                    size={'$5'}
                    borderRadius={0}
                    borderBottomColor={'$gray10Light'}
                    justifyContent="flex-start"
                    onPress={() => {
                      setSheetOpen(true);
                      onEdit(id);
                    }}
                  >
                    <SizableText fontSize={'$5'}>Edit</SizableText>
                  </Button>
                </Popover.Close>

                <Popover.Close asChild fd={'row'}>
                  <Button
                    icon={NotebookPen}
                    size={'$5'}
                    borderRadius={0}
                    borderBottomColor={'$gray10Light'}
                    justifyContent="flex-start"
                    onPress={() => {
                      console.log('note', note);
                      router.push({
                        pathname: '/fullnote',
                        params: { note: note, id: id },
                      });
                    }}
                  >
                    <SizableText fontSize={'$5'}>{note ? 'Edit Note' : 'Add Note'}</SizableText>
                  </Button>
                </Popover.Close>

                <Popover.Close asChild fd={'row'}>
                  <Button
                    icon={Trash2}
                    size={'$5'}
                    borderRadius={0}
                    justifyContent="flex-start"
                    onPress={() => {
                      deleteMutation.mutate(id);
                    }}
                  >
                    <SizableText fontSize={'$5'}>Delete</SizableText>
                  </Button>
                </Popover.Close>
              </YStack>
            </Popover.Content>
          </Popover>
        </YStack>
      </XStack>
    </YStack>
  );
};

export default MoodDisplay;
