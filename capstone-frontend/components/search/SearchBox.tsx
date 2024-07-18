import React, { useRef, useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { useSearchBox, UseSearchBoxProps } from 'react-instantsearch-core';
import { Input } from 'tamagui';

type SearchBoxProps = UseSearchBoxProps & {
  onChange: (newValue: string) => void;
};

export function SearchBox({ onChange, ...props }: SearchBoxProps) {
  const { query, refine } = useSearchBox(props);
  const [inputValue, setInputValue] = useState(query);
  const inputRef = useRef<TextInput>(null);

  function setQuery(newQuery: string) {
    setInputValue(newQuery);
    refine(newQuery);
  }

  // Track when the InstantSearch query changes to synchronize it with
  // the React state.
  // We bypass the state update if the input is focused to avoid concurrent
  // updates when typing.
  if (query !== inputValue && !inputRef.current?.isFocused()) {
    setInputValue(query);
  }

  return (
    <Input
      ref={inputRef}
      borderColor={'pink'}
      focusStyle={{ borderColor: 'pink', borderWidth: 3 }}
      borderWidth={2}
      elevation={2}
      flex={1}
      size={'$4'}
      placeholder="Search Resource Articles..."
      value={inputValue}
      onChangeText={(newValue) => {
        setQuery(newValue);
        onChange(newValue);
      }}
      clearButtonMode="while-editing"
      autoCapitalize="none"
      autoCorrect={false}
      spellCheck={false}
      autoComplete="off"
    />
  );
}
