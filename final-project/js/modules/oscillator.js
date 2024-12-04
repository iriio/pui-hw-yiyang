/**
 * OscillatorModule Class
 * Manages oscillator parameters and routing
 */
export class OscillatorModule {
  /**
   * creates a new OscillatorModule instance
   * @param {AudioEngine} audioEngine - its parent audio engine instance
   */
  constructor(audioEngine) {
    this.audioEngine = audioEngine;
    this.osc1Type = "triangle";
    this.osc2Type = "sine";
    this.detuneValue = 0;
    this.subGainValue = 0;
  }

  /**
   * sets the waveform type for an oscillator
   * @param {number} oscillator - oscillator number (1 or 2)
   * @param {string} type - waveform type (sine tri etc)
   */
  setOscillatorType(oscillator, type) {
    const synth =
      oscillator === 1 ? this.audioEngine.synth1 : this.audioEngine.synth2;

    synth.set({
      oscillator: { type },
    });

    if (oscillator === 1) {
      this.osc1Type = type;
    } else {
      this.osc2Type = type;
    }
  }

  /**
   * sets the mix balance between oscs
   * @param {number} value - mix value (0-1)
   */
  setMix(value) {
    const mix = parseFloat(value);
    const rampTime = 0.016;
    const now = Tone.now();

    this.audioEngine.synth1.volume.linearRampToValueAtTime(
      Math.cos((mix * Math.PI) / 2) * 12 - 6,
      now + rampTime
    );
    this.audioEngine.synth2.volume.linearRampToValueAtTime(
      Math.sin((mix * Math.PI) / 2) * 12 - 6,
      now + rampTime
    );
  }

  /**
   * setsthe detune amount for osc 2
   * @param {number} value - detune value
   */
  setDetune(value) {
    this.detuneValue = value * 100;
    this.audioEngine.synth2.set({
      detune: this.detuneValue,
    });
  }

  /**
   * sets the sub osc level
   * @param {number} value -  level value (0-1)
   */
  setSubOscLevel(value) {
    this.subGainValue = value;
    this.audioEngine.subSynth.volume.value = value * 24 - 24;
  }
}
