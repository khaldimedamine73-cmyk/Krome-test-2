
import { 
  SYSEX_START, 
  SYSEX_END, 
  UNIVERSAL_NON_REALTIME, 
  DEVICE_ID_ALL, 
  TUNING_SUB_ID, 
  SCALE_TUNING_1BYTE_SUB_ID 
} from '../constants';

export class MidiService {
  private midiAccess: MIDIAccess | null = null;
  private output: MIDIOutput | null = null;

  async initialize(): Promise<MIDIOutput[]> {
    try {
      this.midiAccess = await navigator.requestMIDIAccess({ sysex: true });
      const outputs: MIDIOutput[] = [];
      this.midiAccess.outputs.forEach((output) => {
        outputs.push(output);
      });
      return outputs;
    } catch (err) {
      console.error("Could not access MIDI devices.", err);
      return [];
    }
  }

  setOutput(outputId: string) {
    if (this.midiAccess) {
      this.output = this.midiAccess.outputs.get(outputId) || null;
    }
  }

  /**
   * Sends MIDI Tuning Standard (MTS) Scale/Octave Tuning (1-Byte form)
   * This is generally supported by Korg and other modern synths.
   * @param tunings Array of 12 values in cents (0 is center).
   */
  sendScaleTuning(tunings: number[]) {
    if (!this.output) return;

    // Standard MTS Scale Tuning Message
    // F0 7E <device ID> 08 08 <mask1> <mask2> <tuning data x 12> F7
    // Mask: 0xFFFF means apply to all octaves (bits 0-11 represent C to B)
    const mask1 = 0xFF; // All notes mask high byte
    const mask2 = 0xFF; // All notes mask low byte

    // Tuning data: 1 byte per semitone. 64 (0x40) is center (0 cents).
    // Range is -64 to +63 cents. -50 cents = 64 - 50 = 14 (0x0E).
    const tuningBytes = tunings.map(t => {
      let val = 64 + t;
      val = Math.max(0, Math.min(127, val));
      return val;
    });

    const msg = [
      SYSEX_START,
      UNIVERSAL_NON_REALTIME,
      DEVICE_ID_ALL,
      TUNING_SUB_ID,
      SCALE_TUNING_1BYTE_SUB_ID,
      mask1,
      mask2,
      ...tuningBytes,
      SYSEX_END
    ];

    this.output.send(msg);
  }

  sendPitchBend(value: number, channel: number = 0) {
    if (!this.output) return;
    // Value: 0 to 16383 (8192 is center)
    const lsb = value & 0x7F;
    const msb = (value >> 7) & 0x7F;
    this.output.send([0xE0 | (channel & 0x0F), lsb, msb]);
  }

  sendProgramChange(program: number, channel: number = 0) {
    if (!this.output) return;
    this.output.send([0xC0 | (channel & 0x0F), program & 0x7F]);
  }
}

export const midiService = new MidiService();
