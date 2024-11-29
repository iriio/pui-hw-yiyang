export class OscillatorModule {
  constructor(audioEngine) {
    this.audioEngine = audioEngine;
    this.osc1Type = "triangle";
    this.osc2Type = "sine";
    this.detuneValue = 0;
    this.subGainValue = 0;
  }

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

  setDetune(value) {
    this.detuneValue = value * 100;
    this.audioEngine.synth2.set({
      detune: this.detuneValue,
    });
  }

  setSubOscLevel(value) {
    this.subGainValue = value;
    this.audioEngine.subSynth.volume.value = value * 24 - 24;
  }
}
