import React, { useState } from 'react';
import { useRefinementList, UseRefinementListProps } from 'react-instantsearch-core';
import { XStack, SizableText, Button } from 'tamagui';

type FilterBtnProps = {
  item: ReturnType<typeof useRefinementList>['items'][0];
  onToggle: () => void;
};

export default function FilterBtn({ item, onToggle }: FilterBtnProps) {
  const [isInRefinementList, setIsInRefinementList] = useState(false);

  return (
    <Button
      size={'$3'}
      borderWidth={'$1'}
      borderColor={'$color6'}
      bg={isInRefinementList ? 'yellowgreen' : '$background'}
      onPress={() => {
        onToggle();
        setIsInRefinementList((prev) => !prev);
      }}
    >
      {item.label}
      <XStack bg={'$backgroundPress'} borderRadius={'$6'} px={'$2'}>
        <SizableText>{item.count}</SizableText>
      </XStack>
    </Button>
  );
}
