import { AudioEngine } from "./modules/audioEngine.js";
import { OscillatorModule } from "./modules/oscillator.js";
import { SequencerModule } from "./modules/sequencer.js";
import { Visualizer } from "./modules/visualizer.js";
import { KeyboardModule } from "./modules/keyboard.js";
import { TabManager } from "./modules/tabManager.js";

class WebSynth {
  constructor() {
    console.log("WebSynth constructor called");
    this.audioEngine = new AudioEngine();
    this.oscillatorModule = null;
    this.sequencer = null;
    this.keyboard = null;
    this.visualizers = new Map();
    this.initialized = false;
    this.tabManager = null;

    if (!window.location.pathname.includes("landing")) {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => this.initUI());
      } else {
        this.initUI();
      }
    }
  }

  async initUI() {
    // Initialize everything except audio
    this.setupSideNav();
    this.initializeSliders();
    this.keyboard = new KeyboardModule(this);
    this.keyboard.setupKeyboard();
    this.tabManager = new TabManager(this);
    this.sequencer = new SequencerModule(this);
    this.sequencer.updateUI();
    this.bindControls();

    // Set up silent audio initialization on first music interaction to get away with browser autoblock
    const initAudioOnFirstMusic = async (e) => {
      if (
        e.type === "keydown" &&
        !this.keyboard?.keyboardMap[e.key.toLowerCase()]
      )
        return;

      if (!this.initialized) {
        try {
          await Tone.start();
          await this.audioEngine.init();
          this.oscillatorModule = new OscillatorModule(this.audioEngine);
          this.setupAllVisualizations();
          this.initialized = true;

          // Remove listeners after init success
          window.removeEventListener("keydown", initAudioOnFirstMusic);
          document
            .querySelector("#keyboard")
            ?.removeEventListener("mousedown", initAudioOnFirstMusic);
          document
            .querySelector(".sequence-row")
            ?.removeEventListener("mousedown", initAudioOnFirstMusic);
        } catch (error) {
          console.error("Error starting audio:", error);
        }
      }
    };

    // Add listeners for first music interaction
    window.addEventListener("keydown", initAudioOnFirstMusic);
    document
      .querySelector("#keyboard")
      ?.addEventListener("mousedown", initAudioOnFirstMusic);
    document
      .querySelector(".sequence-row")
      ?.addEventListener("mousedown", initAudioOnFirstMusic);
  }

  setupSideNav() {
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.querySelector(".sidebar");

    if (!menuToggle || !sidebar) return;

    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });

    // Close sidebar when clicking outside
    document.addEventListener("click", (e) => {
      const isClickInsideSidebar = sidebar.contains(e.target);
      const isClickOnMenuButton = menuToggle.contains(e.target);

      if (
        !isClickInsideSidebar &&
        !isClickOnMenuButton &&
        sidebar.classList.contains("open")
      ) {
        sidebar.classList.remove("open");
      }
    });
  }

  initializeSliders() {
    const updateSliderBackground = (slider) => {
      const min = parseFloat(slider.min) || 0;
      const max = parseFloat(slider.max) || 100;
      const value = parseFloat(slider.value) || 0;
      const percentage = ((value - min) / (max - min)) * 100;
      slider.style.setProperty("--range-progress", `${percentage}%`);
    };

    const initializeAllSliders = () => {
      document.querySelectorAll('input[type="range"]').forEach((slider) => {
        updateSliderBackground(slider);
        slider.addEventListener("input", () => updateSliderBackground(slider));
      });
    };

    initializeAllSliders();

    // Watch for dynamically added sliders
    const observer = new MutationObserver(() => {
      initializeAllSliders();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  noteOn(note) {
    if (!this.audioEngine.synth1) return;

    // Check if it's a drum trigger
    if (["kick", "snare", "hihat", "clap"].includes(note)) {
      this.audioEngine.drumModule.trigger(note);
    } else {
      // Handle regular notes
      this.audioEngine.synth1.triggerAttack(note);
      this.audioEngine.synth2.triggerAttack(note);
      const subNote = Tone.Frequency(note).transpose(-12).toNote();
      this.audioEngine.subSynth.triggerAttack(subNote);
    }

    // Update keyboard UI
    const keyElement = document.querySelector(`[data-note="${note}"]`);
    if (keyElement) keyElement.classList.add("active");
  }

  noteOff(note) {
    if (!this.audioEngine.synth1) return;

    this.audioEngine.synth1.triggerRelease(note);
    this.audioEngine.synth2.triggerRelease(note);

    const subNote = Tone.Frequency(note).transpose(-12).toNote();
    this.audioEngine.subSynth.triggerRelease(subNote);

    // Update keyboard UI
    const keyElement = document.querySelector(`[data-note="${note}"]`);
    if (keyElement) keyElement.classList.remove("active");
  }

  bindControls() {
    // Oscillator type controls
    document.querySelectorAll("#osc1Buttons .osc-button").forEach((button) => {
      button.addEventListener("click", () => {
        document
          .querySelectorAll("#osc1Buttons .osc-button")
          .forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        this.oscillatorModule.setOscillatorType(1, button.dataset.type);
      });
    });

    document.querySelectorAll("#osc2Buttons .osc-button").forEach((button) => {
      button.addEventListener("click", () => {
        document
          .querySelectorAll("#osc2Buttons .osc-button")
          .forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        this.oscillatorModule.setOscillatorType(2, button.dataset.type);
      });
    });

    // Mix control
    const mixControl = document.getElementById("oscMix");
    if (mixControl) {
      mixControl.addEventListener("input", (e) => {
        this.oscillatorModule.setMix(e.target.value);
      });
    }

    // Sub oscillator control
    const subOscControl = document.getElementById("subOsc");
    if (subOscControl) {
      subOscControl.addEventListener("input", (e) => {
        this.oscillatorModule.setSubOscLevel(e.target.value);
      });
    }

    // Detune control
    const detuneControl = document.getElementById("detune");
    if (detuneControl) {
      detuneControl.addEventListener("input", (e) => {
        this.oscillatorModule.setDetune(e.target.value);
      });
    }

    // Filter controls
    const filterFreqControl = document.getElementById("filterFreq");
    if (filterFreqControl) {
      filterFreqControl.addEventListener("input", (e) => {
        const value = Math.pow(2, parseFloat(e.target.value)) * 20;
        this.audioEngine.setFilterParameter("frequency", value);
      });
    }

    const filterResControl = document.getElementById("filterRes");
    if (filterResControl) {
      filterResControl.addEventListener("input", (e) => {
        this.audioEngine.setFilterParameter("Q", e.target.value);
      });
    }

    // Filter type buttons
    document
      .querySelectorAll("#filterTypeButtons .osc-button")
      .forEach((button) => {
        button.addEventListener("click", () => {
          document
            .querySelectorAll("#filterTypeButtons .osc-button")
            .forEach((btn) => btn.classList.remove("active"));
          button.classList.add("active");
          this.audioEngine.filter.type = button.dataset.type;
        });
      });

    // Drive amount control
    const driveControl = document.getElementById("driveAmount");
    if (driveControl) {
      driveControl.addEventListener("input", (e) => {
        this.audioEngine.setDistortionAmount(parseFloat(e.target.value));
      });
    }

    // Envelope controls
    ["attack", "decay", "sustain", "release"].forEach((param) => {
      const control = document.getElementById(param);
      if (control) {
        control.addEventListener("input", (e) => {
          this.audioEngine.setEnvelopeParameter(param, e.target.value);
        });
      }
    });
  }

  setupAllVisualizations() {
    // First clear any existing visualizers
    this.visualizers.forEach((visualizer) => visualizer.cleanup());
    this.visualizers.clear();

    const visualizerConfigs = [
      {
        id: "waveform",
        type: "waveform",
        analyser: this.audioEngine.analysers.waveform,
      },
      {
        id: "preFilterVisualizer",
        type: "frequency",
        analyser: this.audioEngine.analysers.frequency,
      },
      {
        id: "postFilterVisualizer",
        type: "envelope",
        analyser: this.audioEngine.analysers.envelope,
        audioEngine: this.audioEngine,
      },
    ];

    console.log("Setting up visualizations with configs:", visualizerConfigs);

    visualizerConfigs.forEach((config) => {
      const canvas = document.getElementById(config.id);
      if (canvas && config.analyser) {
        console.log(
          `Creating visualizer for ${config.type} with canvas:`,
          canvas
        );
        const visualizer = new Visualizer(
          config.analyser,
          canvas,
          config.type,
          config.audioEngine
        );
        this.visualizers.set(config.type, visualizer);
      } else {
        console.warn(
          `Failed to create visualizer for ${config.type}. Canvas or analyser missing.`
        );
      }
    });
  }
}

// Initialize on load
window.addEventListener("DOMContentLoaded", () => {
  window.synth = new WebSynth();
});
