import React, { forwardRef } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useInfiniteHits, UseInfiniteHitsProps } from 'react-instantsearch-core';
import { YStack } from 'tamagui';

type InfiniteHitsProps = {
  hitComponent: ({ hit }: any) => React.JSX.Element;
  props?: UseInfiniteHitsProps;
};

export const InfiniteHits = forwardRef<FlatList, React.PropsWithChildren<InfiniteHitsProps>>(
  ({ hitComponent: Hit, ...props }, ref) => {
    const { items, isLastPage, showMore } = useInfiniteHits({
      ...props,
      escapeHTML: false,
    });

    return (
      <FlatList
        style={{
          paddingRight: 10,
        }}
        contentContainerStyle={{}}
        ref={ref}
        data={items}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <YStack py={'$2'}></YStack>}
        onEndReached={() => {
          if (!isLastPage) {
            showMore();
          }
        }}
        renderItem={({ item }) => <Hit hit={item} />}
      />
    );
  }
);
