
import { Maqam } from './types';

export const MAQAM_PRESETS: Maqam[] = [
  {
    name: "Rast Do (C)",
    description: "Gamme Rast sur Do. Mi et Si sont en quarts de ton (50 cents flat).",
    tunings: { "E": -50, "B": -50 }
  },
  {
    name: "Rast Sol (G)",
    description: "Gamme Rast sur Sol. Si et Fa# sont en quarts de ton (50 cents flat).",
    tunings: { "B": -50, "F#": -50 }
  },
  {
    name: "Rast Fa (F)",
    description: "Gamme Rast sur Fa. La et Mi sont en quarts de ton (50 cents flat).",
    tunings: { "A": -50, "E": -50 }
  }
];

export const SYSEX_START = 0xF0;
export const SYSEX_END = 0xF7;
export const UNIVERSAL_NON_REALTIME = 0x7E;
export const DEVICE_ID_ALL = 0x7F;
export const TUNING_SUB_ID = 0x08;
export const SCALE_TUNING_1BYTE_SUB_ID = 0x08;
