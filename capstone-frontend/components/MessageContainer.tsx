import React from 'react';
import { View, Text } from 'react-native';
import {
  Avatar,
  Bubble,
  SystemMessage,
  Message,
  MessageText,
  Time,
  SystemMessageProps,
} from 'react-native-gifted-chat';
import { BubbleProps } from 'react-native-gifted-chat';

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

// export const renderCustomView = (props: BubbleProps<any>) => (
//   <View style={{ minHeight: 20, alignItems: 'center' }}>
//     <Text>{props.user?.name}</Text>
//   </View>
// );

// export const renderUsername = (props: BubbleProps<any>) => (
//   <View style={{}}>
//     <Text>{props.currentMessage.user.name}</Text>
//   </View>
// );
