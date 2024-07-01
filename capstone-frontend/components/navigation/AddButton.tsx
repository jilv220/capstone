import { View, Text } from 'react-native';
import React from 'react';
import { Plus } from '@tamagui/lucide-icons';
import { Button, useTheme } from 'tamagui';
interface AddButtonProps {
  handleClick: () => void;
}
const AddButton: React.FC<AddButtonProps> = ({ handleClick }) => {
  const theme = useTheme();
  return (
    <Button
      icon={Plus}
      height={60}
      width={60}
      textAlign="center"
      borderColor={'yellowgreen'}
      borderWidth={2}
      borderRadius={200}
      backgroundColor={theme.background.val === '#050505' ? theme.background : 'white'}
      onPress={handleClick}
      color={'yellowgreen'}
      size={'$5'}
    />
  );
};

export default AddButton;
