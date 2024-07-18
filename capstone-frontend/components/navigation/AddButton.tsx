import { View, Text, Appearance } from 'react-native';
import React from 'react';
import { Plus } from '@tamagui/lucide-icons';
import { Button, useTheme, useThemeName } from 'tamagui';
interface AddButtonProps {
  handleClick: () => void;
}
const AddButton: React.FC<AddButtonProps> = ({ handleClick }) => {
  const theme = useTheme();
  const themeName = useThemeName();

  return (
    <Button
      icon={Plus}
      height={60}
      width={60}
      textAlign="center"
      borderColor={'#F9476C'}
      borderWidth={2}
      borderRadius={200}
      backgroundColor={themeName === 'dark' ? theme.background : 'white'}
      onPress={handleClick}
      color={'#F9476C'}
      size={'$5'}
    />
  );
};

export default AddButton;
