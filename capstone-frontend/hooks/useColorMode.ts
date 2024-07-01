import { useEffect, useState } from 'react';
import { Appearance, ColorSchemeName, useColorScheme } from 'react-native';
import Storage from '@/lib/storage.native';

export type ValidColorMode = 'light' | 'dark' | 'system';

async function saveColorModeToStorage(colorMode: ValidColorMode) {
  await Storage.setItem('color_mode', colorMode);
}

async function getColorModeFromStorage() {
  return await Storage.getItem('color_mode');
}

export function useColorMode() {
  useEffect(() => {
    const loadColorMode = async () => {
      const colorModeInStorage = await getColorModeFromStorage();
      // console.log(`Color Mode onload: ${colorModeInStorage}`);

      Appearance.setColorScheme(
        colorModeInStorage === 'system' ? undefined : (colorModeInStorage as ColorSchemeName)
      );
    };
    loadColorMode();
  }, []);

  const saveColorMode = async (colorMode: ValidColorMode) => {
    await saveColorModeToStorage(colorMode);
    Appearance.setColorScheme(colorMode === 'system' ? undefined : colorMode);
  };

  return saveColorMode;
}
