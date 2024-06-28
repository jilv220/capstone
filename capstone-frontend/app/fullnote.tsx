import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { XStack, YStack, Button, SizableText, Input, TextArea, ScrollView } from 'tamagui';
import { CheckCircle2, ChevronLeft, ChevronRight, X } from '@tamagui/lucide-icons';
import { router, useLocalSearchParams } from 'expo-router';
import BackButton from '@/components/navigation/BackButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMoodLog } from '@/actions/user';
import { MoodLogUpdate } from '@/interfaces/moodLog';

const fullnote = () => {
  const { note, id } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const [newNote, setNewNote] = useState<string | null>(note?.toString() || '');
  const updateMutation = useMutation({
    mutationFn: updateMoodLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mood-log'] });
    },
  });

  return (
    <YStack flex={1} minHeight={'$10'} py={'$10'} px={'$4'}>
      <BackButton />
      <YStack py={'$2'} justifyContent="center">
        <TextArea height={'90%'} placeholder="Add note..." onChangeText={setNewNote}>
          {note || ''}
        </TextArea>
      </YStack>
      <Button
        onPress={() => {
          if (id) {
            const newUpdate: MoodLogUpdate = {
              id: id.toString(),
              note: newNote?.toString(),
            };
            updateMutation.mutate(newUpdate);
            router.push('/');
          }
        }}
        icon={<CheckCircle2 size={'$3'} color={'yellowgreen'} />}
      ></Button>
    </YStack>
  );
};

export default fullnote;
