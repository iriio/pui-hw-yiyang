export class DrumModule {
  constructor(audioEngine) {
    this.audioEngine = audioEngine;
    this.drums = {
      kick: null,
      snare: null,
      hihat: null,
      clap: null,
    };
    this.createDrums();
  }

  createDrums() {
    // Kick Drum
    this.drums.kick = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 5,
      oscillator: { type: "sine" },
      envelope: {
        attack: 0.001,
        decay: 0.2,
        sustain: 0,
        release: 0.2,
      },
    }).toDestination();

    // Snare Drum
    this.drums.snare = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: {
        attack: 0.001,
        decay: 0.2,
        sustain: 0,
        release: 0.2,
      },
    }).toDestination();

    // Hi-hat
    this.drums.hihat = new Tone.MetalSynth({
      frequency: 200,
      envelope: {
        attack: 0.001,
        decay: 0.1,
        release: 0.01,
      },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5,
    }).toDestination();

    // Clap
    this.drums.clap = new Tone.NoiseSynth({
      noise: { type: "pink" },
      envelope: {
        attack: 0.001,
        decay: 0.2,
        sustain: 0,
        release: 0.2,
      },
    }).toDestination();
  }

  trigger(drumType) {
    switch (drumType) {
      case "kick":
        this.drums.kick.triggerAttackRelease("C1", "8n");
        break;
      case "snare":
        this.drums.snare.triggerAttackRelease("8n");
        break;
      case "hihat":
        this.drums.hihat.triggerAttackRelease("32n");
        break;
      case "clap":
        this.drums.clap.triggerAttackRelease("16n");
        break;
    }
  }

  setVolume(drumType, volume) {
    if (this.drums[drumType]) {
      this.drums[drumType].volume.value = volume;
    }
  }
}
