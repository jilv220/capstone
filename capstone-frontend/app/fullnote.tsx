import { View, Text, KeyboardAvoidingView } from 'react-native';
import React, { useState } from 'react';
import { XStack, YStack, Button, SizableText, Input, TextArea, ScrollView } from 'tamagui';
import { CheckCircle2, ChevronLeft, ChevronRight, X } from '@tamagui/lucide-icons';
import { router, useLocalSearchParams } from 'expo-router';
import BackButton from '@/components/navigation/BackButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMoodLog } from '@/actions/user';
import { MoodLogUpdate } from '@/interfaces/moodLog';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView flex={1}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <YStack px={'$4'} height={'225%'}>
            <XStack py={'$4'}>
              <BackButton />
            </XStack>
            <TextArea height={'100%'} placeholder="Add note..." onChangeText={setNewNote}>
              {note || ''}
            </TextArea>
            <Button
              mt={'$5'}
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
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default fullnote;
