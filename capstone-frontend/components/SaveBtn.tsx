import { Check } from '@tamagui/lucide-icons';
import { Button, ButtonProps } from 'tamagui';

type SaveBtnProps = ButtonProps & {
  onSaveBtnPressed: () => void;
};

export default function SaveBtn({ disabled, onSaveBtnPressed, ...props }: SaveBtnProps) {
  return (
    <Button
      icon={Check}
      backgroundColor={'yellowgreen'}
      color={'white'}
      size={50}
      circular
      disabled={disabled}
      disabledStyle={{
        backgroundColor: '$dimYellowgreen',
      }}
      {...props}
      onPress={onSaveBtnPressed}
    ></Button>
  );
}
