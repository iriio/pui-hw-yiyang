import { DrumModule } from "./drumModule.js";
/**
 * AudioEngine Class
 * Handles all audio processing and synthesis
 */
export class AudioEngine {
  /**
   * create a new AudioEngine instance
   * init audio components as null
   */
  constructor() {
    this.synth1 = null;
    this.synth2 = null;
    this.subSynth = null;
    this.filter = null;
    this.distortion = null;
    this.compressor = null;
    this.analysers = {};
    this.drumModule = null;
  }

  /**
   * init all audio components and routing
   * set up synths, effects, analyzers, and mixer routing
   */
  async init() {
    // Create synths
    this.synth1 = new Tone.PolySynth();
    this.synth2 = new Tone.PolySynth();
    this.subSynth = new Tone.PolySynth();
    this.drumModule = new DrumModule(this);

    // Create effects
    this.filter = new Tone.Filter({
      type: "lowpass",
      frequency: 2000,
      Q: 1,
    });

    this.distortion = new Tone.Distortion({
      distortion: 0,
      wet: 0,
    });

    this.compressor = new Tone.Compressor({
      threshold: -20,
      ratio: 4,
      attack: 0.003,
      release: 0.25,
    });

    // Create analyzers
    this.analysers = {
      waveform: new Tone.Analyser("waveform", 1024),
      frequency: new Tone.Analyser("fft", 2048),
      envelope: new Tone.Analyser("waveform", 1024),
    };

    // Create mixer for analyzers
    const preProcessMixer = new Tone.Gain();
    const postProcessMixer = new Tone.Gain();

    // Connect synths to main signal path and analyzers
    [this.synth1, this.synth2, this.subSynth].forEach((synth) => {
      synth.connect(this.filter);
      synth.connect(preProcessMixer);
    });

    // Main signal path
    this.filter.connect(this.distortion);
    this.distortion.connect(this.compressor);
    this.compressor.connect(Tone.Destination);
    this.compressor.connect(postProcessMixer);

    // Connect to analyzers
    preProcessMixer.connect(this.analysers.waveform);
    preProcessMixer.connect(this.analysers.frequency);
    postProcessMixer.connect(this.analysers.envelope);

    // Set initial values
    const synthOptions = {
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.5,
        release: 0.1,
      },
    };

    this.synth1.set(synthOptions);
    this.synth2.set(synthOptions);
    this.subSynth.set(synthOptions);

    // Set initial volumes
    this.synth1.volume.value = -6;
    this.synth2.volume.value = -6;
    this.subSynth.volume.value = -12;

    // Set analyzer parameters
    if (this.analysers.frequency) {
      this.analysers.frequency.smoothing = 0.8;
      this.analysers.frequency.minDecibels = -100;
      this.analysers.frequency.maxDecibels = -30;
    }
  }

  /**
   * update ADSR param for all synths
   * @param {string} parameter - A/D/S/R
   * @param {number} value - new value for the param
   */
  setEnvelopeParameter(parameter, value) {
    const numValue = parseFloat(value);
    const synthParams = {
      envelope: { [parameter]: numValue },
    };

    // Update all synths
    [this.synth1, this.synth2, this.subSynth].forEach((synth) => {
      synth.set(synthParams);
      // Store the current envelope state
      if (!synth._envelopeState) synth._envelopeState = {};
      synth._envelopeState[parameter] = numValue;
    });

    // Trigger visualizer update if needed
    if (this.analysers.envelope) {
      this.analysers.envelope.setValue(this.synth1.get().envelope);
    }
  }
  setFilterParameter(parameter, value) {
    // add ramping to prevent clicks
    const rampTime = 0.016; // ~1 frame at 60fps
    this.filter[parameter].linearRampToValueAtTime(
      value,
      Tone.now() + rampTime
    );
  }

  /**
   * sets the amount of distortion
   * @param {number} amount - distortion amount (0-1)
   */
  setDistortionAmount(amount) {
    this.distortion.distortion = amount;
    this.distortion.wet.value = amount / 2;
  }
}
