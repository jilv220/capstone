import { View, Text } from 'react-native';
import React from 'react';
import { Plus } from '@tamagui/lucide-icons';
import { Button } from 'tamagui';
interface AddButtonProps {
  handleClick: () => void;
}
const AddButton: React.FC<AddButtonProps> = ({ handleClick }) => {
  return (
    <Button
      icon={Plus}
      height={60}
      width={60}
      textAlign="center"
      borderColor={'yellowgreen'}
      borderWidth={2}
      borderRadius={200}
      backgroundColor={'white'}
      onPress={handleClick}
      color={'yellowgreen'}
      size={'$5'}
    />
  );
};

export default AddButton;
