
export interface MidiDevice {
  id: string;
  name: string;
  manufacturer: string;
}

export interface ScaleTuning {
  [key: number]: number; // 0 for natural, -50 for quarter flat, etc.
}

export interface Maqam {
  name: string;
  description: string;
  tunings: { [key: string]: number }; // e.g., { "E": -50, "B": -50 }
}

export enum NoteName {
  C = 0,
  Db = 1,
  D = 2,
  Eb = 3,
  E = 4,
  F = 5,
  Gb = 6,
  G = 7,
  Ab = 8,
  A = 9,
  Bb = 10,
  B = 11
}

export const NOTE_LABELS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
