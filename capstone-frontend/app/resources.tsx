import BackButton from '@/components/navigation/BackButton';
import FilterBtn from '@/components/search/FilterBtn';
import { InfiniteHits } from '@/components/search/InfiniteHits';
import { SearchBox } from '@/components/search/SearchBox';
import { useRef } from 'react';
import { useRefinementList } from 'react-instantsearch-core';
import { FlatList, KeyboardAvoidingView } from 'react-native';
import { Card, ScrollView, SizableText, XGroup, XStack, YStack } from 'tamagui';

export default function ResourcesScreen() {
  const { items, refine } = useRefinementList({ attribute: 'resource_name', sortBy: ['count'] });
  const mappedItems = items.map((item) => ({
    ...item,
    label: item.label.replaceAll('_', ' '),
  }));

  const listRef = useRef<FlatList>(null);
  function scrollToTop() {
    listRef.current?.scrollToOffset({ animated: false, offset: 0 });
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <YStack px={'$4'} mt={'$7'} flex={1}>
        <XStack>
          <BackButton />
        </XStack>
        <XStack alignItems="center" my={'$3'}>
          <SearchBox onChange={scrollToTop} />
        </XStack>
        <XStack mb={'$2'}>
          <ScrollView horizontal>
            <XGroup gap={'$3'} mb={'$2'}>
              {mappedItems.map((item, idx) => {
                return (
                  <XGroup.Item key={idx}>
                    <FilterBtn
                      item={item}
                      onToggle={() => {
                        refine(item.value);
                        scrollToTop();
                      }}
                    />
                  </XGroup.Item>
                );
              })}
            </XGroup>
          </ScrollView>
        </XStack>
        <YStack flex={1} ai={'flex-start'}>
          <InfiniteHits hitComponent={Hit} ref={listRef} />
        </YStack>
      </YStack>
    </KeyboardAvoidingView>
  );
}

function Hit({ hit }: any) {
  return (
    <Card key={hit.id} elevate elevation={2} size={'$4'} borderRadius={4} padded height={200}>
      <SizableText size={'$7'} fontWeight={'bold'} pb={'$3'}>
        {hit.title}
      </SizableText>
      <SizableText>{hit.content.split(' ').slice(0, 15).join(' ')}...</SizableText>
    </Card>
  );
}
