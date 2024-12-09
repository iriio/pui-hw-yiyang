/**
 * SequencerModule Class
 * Handles step sequencing and pattern playback
 */
export class SequencerModule {
  /**
   * creates a new SequencerModule instance
   * @param {WebSynth} webSynth - its parent WebSynth instance
   */
  constructor(webSynth) {
    this.webSynth = webSynth;
    this.playing = false;
    this.currentStep = 0;
    this.bpm = 120;
    this.reverse = false;
    this.maxNotesPerStep = 3;

    // Separate steps for melodic notes and drums
    this.melodicSteps = Array(16)
      .fill()
      .map(() => ({
        notes: [],
        duration: "8n",
      }));

    this.drumSteps = Array(16)
      .fill()
      .map(() => ({
        notes: [],
        duration: "8n",
      }));

    this.sequence = new Tone.Sequence(
      (time, stepIndex) => {
        // Calculate current step
        this.currentStep = this.reverse ? 15 - stepIndex : stepIndex;

        // Schedule visual updates to happen right at the start of the step
        Tone.Draw.schedule(() => {
          // Update step highlights
          const steps = document.querySelectorAll(".step");
          steps.forEach((step, i) => {
            step.classList.toggle("current", i === this.currentStep);
          });
        }, time);

        // Play the notes
        const drumStep = this.drumSteps[this.currentStep];
        const melodicStep = this.melodicSteps[this.currentStep];

        // Play drums
        drumStep.notes.forEach((note) => {
          if (note && ["kick", "snare", "hihat", "clap"].includes(note)) {
            this.webSynth.audioEngine.drumModule.trigger(note);
            const keyElement = document.querySelector(`[data-note="${note}"]`);
            if (keyElement) {
              keyElement.classList.add("active");
              setTimeout(() => {
                keyElement.classList.remove("active");
              }, 100);
            }
          }
        });

        // Play melodic notes
        melodicStep.notes.forEach((note) => {
          if (note && !["kick", "snare", "hihat", "clap"].includes(note)) {
            this.webSynth.audioEngine.synth1.triggerAttackRelease(
              note,
              melodicStep.duration,
              time
            );
            this.webSynth.audioEngine.synth2.triggerAttackRelease(
              note,
              melodicStep.duration,
              time
            );
            const subNote = Tone.Frequency(note).transpose(-12).toNote();
            this.webSynth.audioEngine.subSynth.triggerAttackRelease(
              subNote,
              melodicStep.duration,
              time
            );

            const keyElement = document.querySelector(`[data-note="${note}"]`);
            if (keyElement) {
              keyElement.classList.add("active");
              const indicator = keyElement.querySelector(".key.indicator");
              if (indicator) {
                indicator.style.backgroundColor = "#e7610850";
                indicator.style.boxShadow =
                  "inset 0 0 5px var(--color-secondary), 0 0 4px 1px var(--color-secondary)";
              }

              setTimeout(() => {
                keyElement.classList.remove("active");
                if (indicator) {
                  indicator.style.backgroundColor = "";
                  indicator.style.boxShadow = "";
                }
              }, Tone.Time(melodicStep.duration).toMilliseconds());
            }
          }
        });
      },
      [...Array(16).keys()],
      "8n"
    );

    Tone.Transport.bpm.value = this.bpm;

    this.createTransportControls();
    this.createUI();
    this.bindEvents();

    //drum presets
    this.presets = [
      {
        name: "BASIC",
        pattern: {
          drums: [
            { step: 0, note: "kick" },
            { step: 4, note: "kick" },
            { step: 8, note: "kick" },
            { step: 12, note: "kick" },
            { step: 2, note: "snare" },
            { step: 6, note: "snare" },
            { step: 10, note: "snare" },
            { step: 14, note: "snare" },
          ],
        },
      },
      {
        name: "HOUSE",
        pattern: {
          drums: [
            { step: 0, note: "kick" },
            { step: 4, note: "kick" },
            { step: 8, note: "kick" },
            { step: 12, note: "kick" },
            { step: 4, note: "clap" },
            { step: 12, note: "clap" },
            { step: 2, note: "hihat" },
            { step: 6, note: "hihat" },
            { step: 10, note: "hihat" },
            { step: 14, note: "hihat" },
          ],
        },
      },
      {
        name: "HIP HOP",
        pattern: {
          drums: [
            { step: 0, note: "kick" },
            { step: 10, note: "kick" },
            { step: 4, note: "snare" },
            { step: 12, note: "snare" },
            { step: 2, note: "hihat" },
            { step: 6, note: "hihat" },
            { step: 10, note: "hihat" },
            { step: 14, note: "hihat" },
          ],
        },
      },
    ];

    this.currentPresetIndex = -1;
  }

  /**
   * creates the sequencer ui
   * sets up step grid for melody and drum patterns
   */
  createUI() {
    // Create drum row
    const drumRow = document.querySelector(".sequence-row.drums");
    if (drumRow) {
      drumRow.innerHTML = this.drumSteps
        .map(
          (step, i) => `
              <div class="step-column">
                  <div class="step-marker">${i + 1}</div>
                  <div class="step drum-step" data-step="${i}" data-type="drum">
                      ${step.notes
                        .map(
                          (note) => `<div class="note drum-note">${note}</div>`
                        )
                        .join("")}
                  </div>
              </div>
              `
        )
        .join("");
    }

    // Create melodic row
    const melodicRow = document.querySelector(".sequence-row.melodic");
    if (melodicRow) {
      melodicRow.innerHTML = this.melodicSteps
        .map(
          (step, i) => `
              <div class="step-column">
                  <div class="step-marker">${i + 1}</div>
                  <div class="step melodic-step" data-step="${i}" data-type="melodic">
                      ${step.notes
                        .map(
                          (note) =>
                            `<div class="note melodic-note">${note}</div>`
                        )
                        .join("")}
                  </div>
              </div>
              `
        )
        .join("");
    }
  }

  /**
   * records a note to the current step
   * @param {string} note - the note to record
   * @param {number} stepIndex - the step to record to
   */
  recordNote(note, stepIndex = this.currentStep) {
    if (stepIndex >= 0 && stepIndex < 16) {
      const isDrum = ["kick", "snare", "hihat", "clap"].includes(note);
      const currentStepNotes = isDrum
        ? this.drumSteps[stepIndex].notes
        : this.melodicSteps[stepIndex].notes;

      if (currentStepNotes.length < this.maxNotesPerStep) {
        // Add note to current step if there's room (limit to 3)
        currentStepNotes.push(note);
        this.updateUI();

        // Find next available step
        let nextStep = (stepIndex + 1) % 16;
        let stepsChecked = 0;

        while (stepsChecked < 16) {
          const nextStepNotes = isDrum
            ? this.drumSteps[nextStep].notes
            : this.melodicSteps[nextStep].notes;

          if (nextStepNotes.length < this.maxNotesPerStep) {
            // Found an available step
            this.currentStep = nextStep;
            break;
          }

          nextStep = (nextStep + 1) % 16;
          stepsChecked++;
        }

        // If all steps are full, stay on the last attempted step
        if (stepsChecked === 16) {
          this.currentStep = stepIndex;
        }

        // Scroll if needed
        this.scrollToStep(this.currentStep);
      }
    }
  }

  /**
   * updates the sequencer user interface
   * updates step highlighting and note display
   */
  updateUI() {
    // update drum step highlighting
    document.querySelectorAll(".drum-step").forEach((step, i) => {
      step.classList.toggle("current", i === this.currentStep);

      // update drum notes
      const stepData = this.drumSteps[i];
      if (stepData && stepData.notes) {
        step.innerHTML = stepData.notes
          .map((note) => `<div class="note drum-note">${note}</div>`)
          .join("");
      }
    });

    // update melodic step highlighting
    document.querySelectorAll(".melodic-step").forEach((step, i) => {
      step.classList.toggle("current", i === this.currentStep);

      // update melodic notes
      const stepData = this.melodicSteps[i];
      if (stepData && stepData.notes) {
        step.innerHTML = stepData.notes
          .map((note) => `<div class="note melodic-note">${note}</div>`)
          .join("");
      }
    });

    // update play button
    const playButton = document.querySelector(".sequencer-play");
    if (playButton) {
      const icon = playButton.querySelector("i");
      const label = playButton.querySelector(".sequencer-play-label");

      if (icon) {
        icon.className = this.playing ? "ph-fill ph-pause" : "ph-fill ph-play";
      }
      if (label) {
        label.textContent = this.playing ? "PAUSE" : "PLAY";
      }
    }
  }

  /**
   * creates transport control ui
   * including play, BPM, preset and reverse
   */
  createTransportControls() {
    const transportControls = document.querySelector(".transport-controls");
    if (!transportControls) return;

    // Create play button
    const playButton = document.createElement("button");
    playButton.className = "sequencer-play btn";
    playButton.innerHTML = `<span class="sequencer-play-label">PLAY</span>
    <i class="-fill ph-play"><i>`;
    const playButtonWrapper = document.createElement("div");
    playButtonWrapper.className = "button-wrapper";
    playButtonWrapper.appendChild(playButton);

    // Create BPM control
    const bpmControl = document.createElement("div");
    bpmControl.className = "bpm-control";

    const bpmLabelContainer = document.createElement("div");
    bpmLabelContainer.className = "bpm-label-container";
    bpmLabelContainer.innerHTML = `
    <input type="hidden" id="bpm-input" value="120">
    <label for="bpm-input" class="bpm-label">BPM</label>
    <span id="bpmValue" class="bpm-value">120</span>
    `;
    // Create BPM Button Wrapper
    const bpmButtonWrapper = document.createElement("div");
    bpmButtonWrapper.className = "bpm-btn-wrapper";
    bpmButtonWrapper.id = "bpmButtons";

    // Create BPM Plus Button
    const bpmPlus = document.createElement("button");
    bpmPlus.setAttribute("aria-labelledby", "bpmLabel");
    bpmPlus.className = "btn dark bpm-btn bpm-plus";
    bpmPlus.innerHTML = `<i class="ph ph-plus"></i><span class="sr-only">BPM HIGHER</span>`;

    const bpmMinus = document.createElement("button");
    bpmMinus.setAttribute("aria-labelledby", "bpmLabel");
    bpmMinus.className = "btn dark bpm-btn bpm-minus";
    bpmMinus.innerHTML = `<i class="ph ph-minus"></i><span class="sr-only">BPM LOWER</span>`;

    let currentBpm = 120;
    const updateBpm = (delta) => {
      currentBpm = Math.min(Math.max(60, currentBpm + delta), 200);
      document.getElementById("bpmValue").textContent = currentBpm;
      Tone.Transport.bpm.value = currentBpm;
    };

    bpmPlus.addEventListener("click", () => updateBpm(10));
    bpmMinus.addEventListener("click", () => updateBpm(-10));

    bpmButtonWrapper.appendChild(bpmPlus);
    bpmButtonWrapper.appendChild(bpmMinus);
    bpmControl.appendChild(bpmLabelContainer);
    bpmControl.appendChild(bpmButtonWrapper);

    // Create preset button toggle
    const presetButton = document.createElement("button");
    presetButton.className = "preset-button btn dark";
    presetButton.innerHTML = `<i class="ph ph-pulse"></i><span class="sr-only">PRESETS</span>`;
    presetButton.addEventListener("click", () => {
      this.cyclePreset();
    });
    const presetButtonWrapper = document.createElement("div");
    presetButtonWrapper.className = "button-wrapper";
    presetButtonWrapper.appendChild(presetButton);

    // Create clear/reset button

    const resetButton = document.createElement("button");
    resetButton.className = "reset-button btn dark";
    resetButton.innerHTML = `<i class="ph ph-trash"></i><span class="sr-only">RESET</span>`;
    resetButton.addEventListener("click", () => {
      if (this.webSynth.tabManager.currentTab === "sequence") {
        this.clearSequence();
      } else {
        this.resetControls();
      }
    });
    const resetButtonWrapper = document.createElement("div");
    resetButtonWrapper.className = "button-wrapper";
    resetButtonWrapper.appendChild(resetButton);

    const reverseButton = document.createElement("button");
    reverseButton.className = "reverse-button btn dark";
    reverseButton.innerHTML = `<i class="ph ph-swap"></i><span class="sr-only">REVERSE</span>`;
    reverseButton.addEventListener("click", () => {
      this.reverse = !this.reverse;
      reverseButton.classList.toggle("active");
    });
    const reverseButtonWrapper = document.createElement("div");
    reverseButtonWrapper.className = "button-wrapper";
    reverseButtonWrapper.appendChild(reverseButton);

    transportControls.appendChild(playButtonWrapper);
    transportControls.appendChild(bpmControl);
    transportControls.appendChild(presetButtonWrapper);
    transportControls.appendChild(reverseButtonWrapper);
    transportControls.appendChild(resetButtonWrapper);
  }

  /**
   * handles scrolling the step grid
   * @param {number} stepIndex - the step to scroll to
   */
  scrollToStep(stepIndex) {
    const container = document.querySelector(".timeline-content");
    const stepElement = document.querySelector(`[data-step="${stepIndex}"]`);

    if (container && stepElement) {
      const containerWidth = container.offsetWidth;
      const stepColumn = stepElement.closest(".step-column");

      if (stepColumn) {
        const stepLeft = stepColumn.offsetLeft;
        const stepWidth = stepColumn.offsetWidth;

        // Calculate threshold points for scrolling
        const scrollThreshold = containerWidth / 3; // Scroll when step is in the last third
        const currentScroll = container.scrollLeft;
        const stepRightEdge = stepLeft + stepWidth - currentScroll;
        const stepLeftEdge = stepLeft - currentScroll;

        if (stepRightEdge > containerWidth - scrollThreshold) {
          // Step is approaching right edge
          container.scrollTo({
            left: stepLeft - scrollThreshold,
            behavior: "smooth",
          });
        } else if (stepLeftEdge < scrollThreshold) {
          // Step is approaching left edge
          container.scrollTo({
            left: stepLeft - (containerWidth - scrollThreshold),
            behavior: "smooth",
          });
        }
      }
    }
  }

  /**
   * cycles through drum pattern presets
   * loads the next preset in sequence
   */
  cyclePreset() {
    this.currentPresetIndex =
      (this.currentPresetIndex + 1) % this.presets.length;
    const preset = this.presets[this.currentPresetIndex];

    // Only clear drum sequence, preserve melodic sequence
    this.drumSteps = Array(16)
      .fill()
      .map(() => ({
        notes: [],
        duration: "8n",
      }));

    // Load the preset's drum pattern
    if (preset.pattern.drums) {
      preset.pattern.drums.forEach(({ step, note }) => {
        if (this.drumSteps[step].notes.length < this.maxNotesPerStep) {
          this.drumSteps[step].notes.push(note);
        }
      });
    }

    this.updateUI();
  }

  handleKeyDown(event) {
    if (this.webSynth.tabManager.currentTab === "sequence" && !event.repeat) {
      const keyInfo =
        this.webSynth.keyboard?.keyboardMap[event.key.toLowerCase()];
      if (keyInfo?.note) {
        this.recordNote(keyInfo.note);
      }
    }
  }

  handleKeyUp(event) {
    const keyInfo =
      this.webSynth.keyboard?.keyboardMap[event.key.toLowerCase()];
    if (keyInfo?.note) {
      this.webSynth.noteOff(keyInfo.note);
    }
  }

  handleMouseDown(event) {
    if (this.webSynth.tabManager.currentTab === "sequence") {
      const key = event.target.closest("[data-note]");
      if (key) {
        const note = key.dataset.note;
        if (note) {
          this.recordNote(note);
        }
      }
    }
  }

  handleMouseUp(event) {
    const key = event.target.closest("[data-note]");
    if (key) {
      const note = key.dataset.note;
      if (note) {
        this.webSynth.noteOff(note);
      }
    }
  }

  bindEvents() {
    // Play button
    const playButton = document.querySelector(".sequencer-play");
    if (playButton) {
      playButton.addEventListener("click", () => this.togglePlayback());
    }

    // Handle note input
    document.addEventListener("keydown", (e) => this.handleKeyDown(e));
    document.addEventListener("keyup", (e) => this.handleKeyUp(e));
    document.addEventListener("mousedown", (e) => this.handleMouseDown(e));
    document.addEventListener("mouseup", (e) => this.handleMouseUp(e));

    // Global space bar handler
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        this.togglePlayback();
      }
    });

    // Handle note clicks
    document.addEventListener("click", (e) => {
      const step = e.target.closest(".note");
      if (step) {
        // Remove the note when clicked
        const noteToRemove = step.textContent;
        const stepElement = step.closest(".step");
        if (stepElement) {
          const stepIndex = parseInt(stepElement.dataset.step);
          const type = stepElement.dataset.type;
          const stepArray =
            type === "drum" ? this.drumSteps : this.melodicSteps;
          const noteIndex = stepArray[stepIndex].notes.indexOf(noteToRemove);
          if (noteIndex !== -1) {
            stepArray[stepIndex].notes.splice(noteIndex, 1);
            this.updateUI();
          }
        }
      }
      const noteElement = e.target.closest(".note");
      if (noteElement) {
        const noteToRemove = noteElement.textContent;
        const stepElement = noteElement.closest(".step");
        if (stepElement) {
          const stepIndex = parseInt(stepElement.dataset.step);
          const type = stepElement.dataset.type;
          const stepArray =
            type === "drum" ? this.drumSteps : this.melodicSteps;
          const noteIndex = stepArray[stepIndex].notes.indexOf(noteToRemove);
          if (noteIndex !== -1) {
            stepArray[stepIndex].notes.splice(noteIndex, 1);
            this.updateUI();
          }
        }
        return; // Stop here if we clicked a note
      }

      // Handle step selection for recording
      const stepElement = e.target.closest(".step");
      if (stepElement) {
        const newStep = parseInt(stepElement.dataset.step);
        if (!isNaN(newStep)) {
          this.currentStep = newStep;
          document.querySelectorAll(".step").forEach((step) => {
            step.classList.toggle(
              "current",
              step.dataset.step === String(this.currentStep)
            );
          });
        }
      }
    });
  }

  togglePlayback() {
    this.playing = !this.playing;

    if (this.playing) {
      this.sequence.start();
      Tone.Transport.start();
    } else {
      Tone.Transport.pause();
    }

    // Update play button state
    const playButton = document.querySelector(".sequencer-play");
    if (playButton) {
      const icon = playButton.querySelector("i");
      const label = playButton.querySelector(".sequencer-play-label");

      if (icon) {
        icon.className = this.playing ? "ph-fill ph-pause" : "ph-fill ph-play";
      }
      if (label) {
        label.textContent = this.playing ? "PAUSE" : "PLAY";
      }
    }
  }

  clearSequence() {
    this.melodicSteps = Array(16)
      .fill()
      .map(() => ({
        notes: [],
        duration: "8n",
      }));
    this.drumSteps = Array(16)
      .fill()
      .map(() => ({
        notes: [],
        duration: "8n",
      }));
    this.updateUI();
  }

  resetControls() {
    // Reset all synth parameters to default
    this.webSynth.audioEngine.synth1.set({
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.5,
        release: 0.1,
      },
    });
    this.webSynth.audioEngine.synth2.set({
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.5,
        release: 0.1,
      },
    });
    // Reset filter
    this.webSynth.audioEngine.filter.frequency.value = 2000;
    this.webSynth.audioEngine.filter.Q.value = 0.5;
    // Reset distortion
    this.webSynth.audioEngine.setDistortionAmount(0);

    // Update UI controls
    document.querySelectorAll('input[type="range"]').forEach((input) => {
      input.value = input.defaultValue;
      input.dispatchEvent(new Event("input"));
    });
  }
}
