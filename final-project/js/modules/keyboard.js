/**
 * KeyboardModule Class
 * Handles keyboard input and visualization
 */
export class KeyboardModule {
  /**
   * Creates a new KeyboardModule instance
   * @param {WebSynth} webSynth - its parent WebSynth instance
   */
  constructor(webSynth) {
    this.webSynth = webSynth;
    this.activeNotes = new Map();

    this.keyboardMap = {
      a: { note: "C4", label: "A" },
      s: { note: "D4", label: "S" },
      d: { note: "E4", label: "D" },
      f: { note: "F4", label: "F" },
      g: { note: "G4", label: "G" },
      h: { note: "A4", label: "H" },
      j: { note: "B4", label: "J" },
      k: { note: "C5", label: "K" },
      l: { note: "D5", label: "L" },
      ";": { note: "E5", label: ";" },
      "'": { note: "F5", label: "'" },

      // Black keys - top row
      q: { note: "B#4", label: "Q" },
      w: { note: "C#4", label: "W" },
      e: { note: "D#4", label: "E" },
      r: { note: "E#4", label: "R" },
      t: { note: "F#4", label: "T" },
      y: { note: "G#4", label: "Y" },
      u: { note: "A#5", label: "U" },
      i: { note: "B#5", label: "I" },
      o: { note: "C#5", label: "O" },
      p: { note: "D#5", label: "P" },
      "[": { note: "E#5", label: "[" },

      1: { note: "kick", label: "1", type: "drum" },
      2: { note: "snare", label: "2", type: "drum" },
      3: { note: "hihat", label: "3", type: "drum" },
      4: { note: "clap", label: "4", type: "drum" },
    };

    // Bind methods
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  /**
   * sets up the keyboard ui
   * makes DOM elements for keyboard and drum pads
   */
  setupKeyboard() {
    const keyboard = document.getElementById("keyboard");
    if (!keyboard) return;

    const keyboardWrapper = document.createElement("div");
    keyboardWrapper.className = "keyboard-wrapper";

    // Create a wrapper for black keys that will be positioned absolutely
    const blackKeysWrapper = document.createElement("div");
    blackKeysWrapper.className = "black-keys-wrapper";

    // Create a wrapper for white keys
    const whiteKeysWrapper = document.createElement("div");
    whiteKeysWrapper.className = "white-keys-wrapper";

    // Create drums wrapper
    const drumsWrapper = document.createElement("div");
    drumsWrapper.className = "drums-wrapper";

    // Then create all white keys
    Object.entries(this.keyboardMap).forEach(([key, info]) => {
      if (!this.isSharpNote(info.note) && !info.type) {
        const keyElement = this.createKeyElement(key, info);
        whiteKeysWrapper.appendChild(keyElement);
      }
    });

    // Then create all black keys
    Object.entries(this.keyboardMap).forEach(([key, info]) => {
      if (this.isSharpNote(info.note) && !info.type) {
        const keyElement = this.createKeyElement(key, info);
        blackKeysWrapper.appendChild(keyElement);
      }
    });

    // Create all drum pads
    Object.entries(this.keyboardMap).forEach(([key, info]) => {
      if (info.type === "drum") {
        const drumPad = this.createDrumPad(key, info);
        drumsWrapper.appendChild(drumPad);
      }
    });

    // Append everything
    keyboardWrapper.appendChild(blackKeysWrapper);
    keyboardWrapper.appendChild(whiteKeysWrapper);

    keyboard.appendChild(keyboardWrapper);
    keyboard.appendChild(drumsWrapper);

    // Add computer keyboard listeners
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
  }

  /**
   * creates a key element for the virtual keyboard
   * @param {string} key - computer keyboard key
   * @param {Object} info - info on the note
   * @returns {HTMLElement} the created music key element
   */
  createKeyElement(key, info) {
    const keyElement = document.createElement("div");
    const keyCenter = document.createElement("div");
    const keyHighlight = document.createElement("div");
    const keyIndicator = document.createElement("div");

    const isSharp = this.isSharpNote(info.note);

    keyElement.className = `key ${isSharp ? "black" : "white"} block`;
    keyCenter.className = "key center";
    keyHighlight.className = "key highlight";
    keyIndicator.className = "key indicator";

    keyElement.dataset.note = info.note;
    keyElement.dataset.key = key;

    keyElement.innerHTML = `
      <span class="keyboard-key">${info.label}</span>
      <span class="note-label">${info.note}</span>
    `;

    keyElement.appendChild(keyCenter);
    keyElement.appendChild(keyHighlight);
    keyElement.appendChild(keyIndicator);

    // Add event listeners
    keyElement.addEventListener("mousedown", (e) =>
      this.handleMouseDown(e, info.note)
    );
    keyElement.addEventListener("mouseup", () => this.handleMouseUp(info.note));
    keyElement.addEventListener("mouseleave", () =>
      this.handleMouseLeave(info.note)
    );

    return keyElement;
  }

  /**
   * creates a drum pad element
   * @param {string} key - computer keyboard key
   * @param {Object} info - info on the drum
   * @returns {HTMLElement} the created drum pad element
   */
  createDrumPad(key, info) {
    const padElement = document.createElement("div");
    padElement.className = "drum-pad btn dark";
    padElement.dataset.note = info.note;
    padElement.dataset.key = key;

    padElement.innerHTML = `
      <span class="keyboard-key">${info.label}</span>
      <span class="note-label">${info.note}</span>
    `;

    // Add event listeners
    padElement.addEventListener("mousedown", (e) =>
      this.handleMouseDown(e, info.note)
    );
    padElement.addEventListener("mouseup", () => this.handleMouseUp(info.note));
    padElement.addEventListener("mouseleave", () =>
      this.handleMouseLeave(info.note)
    );

    return padElement;
  }

  /**
   * handles keyboard key down events
   * @param {KeyboardEvent} e - The keyboard event
   */
  handleKeyDown(e) {
    // Ignore if command/meta key is pressed
    if (e.metaKey || e.ctrlKey) return;

    if (e.repeat) return;
    const keyInfo = this.keyboardMap[e.key.toLowerCase()];
    if (keyInfo) {
      this.webSynth.noteOn(keyInfo.note);
      // Add active class to the key element
      const keyElement = document.querySelector(
        `[data-note="${keyInfo.note}"]`
      );
      if (keyElement) {
        keyElement.classList.add("active");
      }
    }
  }

  /**
   * handles keyboard key up events
   * @param {KeyboardEvent} e - The keyboard event
   */
  handleKeyUp(e) {
    const keyInfo = this.keyboardMap[e.key.toLowerCase()];
    if (keyInfo) {
      this.webSynth.noteOff(keyInfo.note);
    }
  }

  /**
   * handles mouse down events
   * @param {KeyboardEvent} e - The keyboard event
   */
  handleMouseDown(e, note) {
    this.webSynth.noteOn(note);
  }

  /**
   * handles mouse up events
   * @param {KeyboardEvent} e - The keyboard event
   */
  handleMouseUp(note) {
    this.webSynth.noteOff(note);
  }

  /**
   * handles mouse leave events
   * @param {KeyboardEvent} e - The keyboard event
   */
  handleMouseLeave(note) {
    this.webSynth.noteOff(note);
  }

  isSharpNote(note) {
    return note.includes("#") || note.includes("b");
  }
}
