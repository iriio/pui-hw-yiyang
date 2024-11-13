class WebSynth {
  constructor() {
    this.audioContext = null;
    this.activeNotes = new Map();
    this.setupStartButton();

    // just white keys now, mapped from Z to /
    this.keyboardMap = {
      z: { note: 60, label: "Z" }, // C4
      x: { note: 62, label: "X" }, // D4
      c: { note: 64, label: "C" }, // E4
      v: { note: 65, label: "V" }, // F4
      b: { note: 67, label: "B" }, // G4
      n: { note: 69, label: "N" }, // A4
      m: { note: 71, label: "M" }, // B4
      ",": { note: 72, label: "," }, // C5
      ".": { note: 74, label: "." }, // D5
      "/": { note: 76, label: "/" }, // E5
    };
  }

  //button to get across browser no autoplay
  setupStartButton() {
    const startButton = document.getElementById("startAudio");
    startButton.addEventListener("click", () => {
      if (!this.audioContext) {
        this.initializeAudio();
        startButton.textContent = "Audio Running";
        startButton.disabled = true;
      }
    });
  }

  initializeAudio() {
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.createNodes();
    this.setupInitialValues();
    this.connectNodes();
    this.setupVisualizer();
    this.setupKeyboard();
    this.bindControls();
  }

  createNodes() {
    // Basic audio routing
    this.filter = this.audioContext.createBiquadFilter();
    this.masterGain = this.audioContext.createGain();
    this.analyser = this.audioContext.createAnalyser();
  }

  //default values
  setupInitialValues() {
    this.filter.type = "lowpass";
    this.filter.frequency.value = 5000;
    this.filter.Q.value = 1;
    this.masterGain.gain.value = 0.5;
    this.analyser.fftSize = 2048;
  }

  connectNodes() {
    this.filter.connect(this.masterGain);
    this.masterGain.connect(this.analyser);
    this.masterGain.connect(this.audioContext.destination);
  }

  createOscillator(frequency) {
    // create a pair for detune
    const osc1 = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();
    // volume control
    const gain = this.audioContext.createGain();

    const type = document.getElementById("oscType").value; //sine, square, etc waveform type
    const detune = parseFloat(document.getElementById("detune").value || 0);

    // Set up both oscillators with user input
    [osc1, osc2].forEach((osc) => {
      osc.type = type;
      osc.frequency.value = frequency;
      osc.connect(gain);
    });

    // Detune the second oscillator
    osc2.detune.value = detune;

    gain.connect(this.filter);

    return { osc1, osc2, gain };
  }

  setupVisualizer() {
    const canvas = document.getElementById("waveform");
    if (!canvas) return; //if no canvas exit

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext("2d"); //get 2d context to draw

    const draw = () => {
      requestAnimationFrame(draw); //update
      const bufferLength = this.analyser.frequencyBinCount; // # of data points for the waveform
      const dataArray = new Uint8Array(bufferLength); // array to store waveform data
      this.analyser.getByteTimeDomainData(dataArray); //fill array

      ctx.fillStyle = "#2a2a2a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#e76108";
      ctx.beginPath();

      // a segment of waveform
      const width = canvas.width / bufferLength;
      let x = 0; //LEFT!!!!!!

      // loop through each point in waveform data
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0; // normalize
        const y = v * (canvas.height / 2); // Map to canvas height, center vertically

        if (i === 0) ctx.moveTo(x, y); // first
        else ctx.lineTo(x, y); // to next

        x += width; //next
      }

      ctx.stroke();
    };

    draw();
  }

  bindControls() {
    // Wire up the control panel
    document.getElementById("oscType").addEventListener("change", (e) => {
      this.activeNotes.forEach((osc) => {
        osc.osc1.type = e.target.value;
        osc.osc2.type = e.target.value;
      });
    });

    document.getElementById("detune").addEventListener("input", (e) => {
      const detune = parseFloat(e.target.value);
      this.activeNotes.forEach((osc) => {
        osc.osc2.detune.value = detune;
      });
    });

    document.getElementById("filterFreq").addEventListener("input", (e) => {
      const freq = Math.pow(2, parseFloat(e.target.value)) * 20;
      this.filter.frequency.setValueAtTime(freq, this.audioContext.currentTime);
    });

    document.getElementById("filterRes").addEventListener("input", (e) => {
      this.filter.Q.setValueAtTime(
        parseFloat(e.target.value),
        this.audioContext.currentTime
      );
    });
  }

  setupKeyboard() {
    const keyboard = document.getElementById("keyboard");
    keyboard.innerHTML = "";

    Object.entries(this.keyboardMap).forEach(([key, info]) => {
      const keyElement = document.createElement("div");
      const keyCenter = document.createElement("div");
      const keyHighlight = document.createElement("div");

      keyElement.className = "key white block";
      keyCenter.className = "key center";
      keyHighlight.className = "key highlight";
      keyElement.dataset.note = info.note;

      keyElement.innerHTML = `
          <span class="keyboard-key">${info.label}</span>
          <span class="note-label">${this.getNoteLabel(info.note)}</span>
        `;

      keyElement.appendChild(keyCenter);
      keyElement.appendChild(keyHighlight);
      keyboard.appendChild(keyElement);

      // Mouse controls
      keyElement.addEventListener("mousedown", () => this.noteOn(info.note));
      keyElement.addEventListener("mouseup", () => this.noteOff(info.note));
      keyElement.addEventListener("mouseleave", () => this.noteOff(info.note));
    });

    // Computer keyboard controls
    document.addEventListener("keydown", (e) => {
      const keyInfo = this.keyboardMap[e.key.toLowerCase()];
      if (!e.repeat && keyInfo) this.noteOn(keyInfo.note); // if the key pressed not repeated and if the key is mapped to a note
    });

    document.addEventListener("keyup", (e) => {
      const keyInfo = this.keyboardMap[e.key.toLowerCase()];
      if (keyInfo) this.noteOff(keyInfo.note);
    });
  }

  noteToFrequency(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  getNoteLabel(midiNote) {
    const noteNames = [
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ];
    const noteName = noteNames[midiNote % 12];
    const octave = Math.floor(midiNote / 12) - 1;
    return `${noteName}${octave}`;
  }

  noteOn(note) {
    if (!this.audioContext || this.activeNotes.has(note)) return;

    // convert note to pitch
    const frequency = this.noteToFrequency(note);

    const oscillator = this.createOscillator(frequency);

    // get current time
    const now = this.audioContext.currentTime;

    const attack = parseFloat(document.getElementById("attack").value || 0.1); //fade in

    oscillator.gain.gain.setValueAtTime(0, now);

    oscillator.gain.gain.linearRampToValueAtTime(0.5, now + attack);

    oscillator.osc1.start(now);
    oscillator.osc2.start(now);

    // store active note and oscillator
    this.activeNotes.set(note, oscillator);

    //TODO: !!!not working rn!!!
    const keyElement = document.querySelector(`[data-note="${note}"]`);
    if (keyElement) keyElement.classList.add("active");
  }

  noteOff(note) {
    if (!this.audioContext || !this.activeNotes.has(note)) return;

    const now = this.audioContext.currentTime;

    const oscillator = this.activeNotes.get(note);

    const release = parseFloat(document.getElementById("release").value || 0.1); //fade out

    oscillator.gain.gain.linearRampToValueAtTime(0, now + release);

    oscillator.osc1.stop(now + release + 0.1);
    oscillator.osc2.stop(now + release + 0.1);

    // remove from storage
    this.activeNotes.delete(note);

    //TODO: !!!not working rn!!!
    const keyElement = document.querySelector(`[data-note="${note}"]`);
    if (keyElement) keyElement.classList.remove("active");
  }
}

// Boot it up
window.addEventListener("load", () => new WebSynth());
