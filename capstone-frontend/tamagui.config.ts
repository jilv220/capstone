import { config } from "@tamagui/config/v3";
import { createTamagui } from "tamagui";
import { dark, dark_subtle, light, light_subtle } from "./themes";

export const tamaguiConfig = createTamagui({
  ...config,
  themes: {
    light,
    light_subtle,
    dark,
    dark_subtle,
  },
});

export default tamaguiConfig;
export type Conf = typeof tamaguiConfig;
declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}
