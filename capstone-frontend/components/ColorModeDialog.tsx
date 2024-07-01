import { ValidColorMode, useColorMode } from '@/hooks/useColorMode';
import { useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { AlertDialog, Button, Label, RadioGroup, SizeTokens, XStack, YStack } from 'tamagui';

export function RadioGroupItemWithLabel({
  size,
  value,
  label,
}: {
  size: SizeTokens;
  value: string;
  label: string;
}) {
  const id = `radiogroup-${value}`;
  return (
    <XStack alignItems="center" space="$4">
      <RadioGroup.Item value={value ?? 'system'} id={id} size={size}>
        <RadioGroup.Indicator />
      </RadioGroup.Item>

      <Label size={size} htmlFor={id}>
        {label}
      </Label>
    </XStack>
  );
}

type ColorModeDialogProps = {
  children: React.ReactNode;
};

export default function ColorModeDialog({ children }: ColorModeDialogProps) {
  const colorMode = Appearance.getColorScheme() ?? 'system';
  const saveColorMode = useColorMode();
  const [radioValue, setRadioValue] = useState('system');

  return (
    <AlertDialog>
      <AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <AlertDialog.Content
          bordered
          elevate
          key="content"
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
        >
          <YStack gap px={'$3'}>
            <AlertDialog.Title fontSize={'$8'}>Select your Color Mode</AlertDialog.Title>
            <AlertDialog.Description>
              <RadioGroup
                defaultValue={colorMode}
                onValueChange={(value) => {
                  setRadioValue(value);
                }}
              >
                <YStack gap={'$2'} my={'$4'}>
                  <RadioGroupItemWithLabel size={'$3'} value={'light'} label={'Light'} />
                  <RadioGroupItemWithLabel size={'$3'} value={'dark'} label={'Dark'} />
                  <RadioGroupItemWithLabel size={'$3'} value={'system'} label={'System'} />
                </YStack>
              </RadioGroup>
            </AlertDialog.Description>

            <XStack space="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <Button>Cancel</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button
                  theme="active"
                  onPress={async () => {
                    await saveColorMode(radioValue as ValidColorMode);
                  }}
                >
                  Save
                </Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
