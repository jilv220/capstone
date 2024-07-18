import { active } from 'd3';
import React from 'react';
import {
  Avatar,
  Bubble,
  SystemMessage,
  Message,
  MessageText,
  Time,
  SystemMessageProps,
  InputToolbar,
  Composer,
} from 'react-native-gifted-chat';
import { BubbleProps } from 'react-native-gifted-chat';
import { YStack, Button, XStack, View, Footer, useTheme } from 'tamagui';

const AI_BackgoundColor = '#f90949';
const User_BackgoundColor = '#ffffff';
const AI_TextColor = '#ffffff';
const User_TextColor = '#f90949';
const Date_Color = '#000000';

export const renderAvatar = (props: any) => (
  <Avatar
    {...props}
    containerStyle={{ left: {}, right: {} }}
    imageStyle={{ left: {}, right: {} }}
  />
);

export const renderBubble = (props: BubbleProps<any>) => (
  <Bubble
    {...props}
    containerStyle={{
      left: { borderColor: 'transparent', borderWidth: 8 },
      right: { borderColor: 'transparent', borderWidth: 8 },
    }}
    wrapperStyle={{
      left: { borderColor: AI_BackgoundColor, borderWidth: 4 },
      right: { borderColor: User_BackgoundColor, borderWidth: 4 },
    }}
    bottomContainerStyle={{
      left: { backgroundColor: AI_BackgoundColor },
      right: { backgroundColor: User_BackgoundColor },
    }}
    tickStyle={{}}
    usernameStyle={{ color: 'black', fontWeight: '100' }}
    containerToNextStyle={{
      left: { borderColor: 'navy', borderWidth: 4 },
      right: {},
    }}
    containerToPreviousStyle={{
      left: { borderColor: 'mediumorchid', borderWidth: 4 },
      right: {},
    }}
  />
);

export const renderSystemMessage = (props: any) => (
  <SystemMessage
    {...props}
    containerStyle={{ backgroundColor: 'transparent' }}
    wrapperStyle={{ borderWidth: 10, borderColor: 'transparent' }}
    textStyle={{ color: 'crimson', fontWeight: '900' }}
  />
);

export const renderMessage = (props: any) => (
  <Message
    {...props}
    containerStyle={{
      left: {},
      right: {},
    }}
  />
);

export const renderTime = (props: any) => (
  <Time
    {...props}
    timeTextStyle={{
      left: { color: Date_Color },
      right: { color: Date_Color },
    }}
  />
);

export const renderMessageText = (props: any) => (
  <MessageText
    {...props}
    containerStyle={{
      left: { backgroundColor: AI_BackgoundColor },
      right: { backgroundColor: User_BackgoundColor },
    }}
    textStyle={{
      left: { color: AI_TextColor },
      right: { color: User_TextColor },
    }}
    linkStyle={{
      left: { color: 'orange' },
      right: { color: 'orange' },
    }}
    customTextStyle={{ fontSize: 24, lineHeight: 24 }}
  />
);

export const renderInputToolbar = (props: any, theme: any) => {
  return (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: theme.background.val === '#050505' ? '#050505' : 'white',
      }}
      renderComposer={(composerProps) => (
        <Composer
          {...composerProps}
          textInputStyle={{
            color: theme.background.val === '#050505' ? 'white' : 'black',
          }}
        />
      )}
    />
  );
};

const quickOptions = [
  'feel sad',
  'anxious',
  'lonely',
  'in flashback',
  'self-harm',
  'suicidal thoughts',
];
export const FootComponent = ({ onPressQuickOptions, theme }: any) => (
  <YStack>
    <XStack flexWrap="wrap" justifyContent="space-evenly" margin={1}>
      {quickOptions.map((option, index) => {
        return (
          <Button
            key={index}
            margin={1}
            flexBasis={'32%'}
            fontFamily={'$heading'}
            fontSize={'$1'}
            backgroundImage={require('../assets/images/bubble.png')}
            color={theme.background.val === '#050505' ? 'pink' : '#F9476C'}
            borderWidth={'$1'}
            marginHorizontal={1}
            pressStyle={{ borderColor: AI_BackgoundColor }}
            onPress={() => {
              onPressQuickOptions(option);
            }}
          >
            {option}
          </Button>
        );
      })}
    </XStack>
  </YStack>
);
