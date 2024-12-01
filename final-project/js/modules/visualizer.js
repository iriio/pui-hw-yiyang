export class Visualizer {
  constructor(analyser, canvas, type = "waveform", audioEngine = null) {
    this.analyser = analyser;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.type = type;
    this.audioEngine = audioEngine;
    this.animationFrame = null;

    // For frequency visualization
    this.frequencyHistory = Array(30).fill(new Float32Array(128));
    this.hueRotation = 0;

    this.setupCanvas();
    this.startAnimation();
  }

  setupCanvas() {
    const resizeCanvas = () => {
      const container = this.canvas.parentElement;
      const containerRect = container.getBoundingClientRect();
      this.canvas.width = containerRect.width - 8;
      this.canvas.height = containerRect.height - 28;
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(this.canvas.parentElement);
  }

  drawWaveform(data) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw center line
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#FF395D";
    this.ctx.moveTo(0, this.canvas.height / 2);
    this.ctx.lineTo(this.canvas.width, this.canvas.height / 2);
    this.ctx.stroke();

    // Draw waveform

    const sliceWidth = this.canvas.width / data.length;
    let x = 0;

    for (let i = 0; i < data.length; i++) {
      const v = data[i];
      const y = ((v + 1) / 2) * this.canvas.height;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    this.ctx.strokeStyle = "#FF395D";
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  drawFrequencySpectrum(data) {
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Clear canvas completely
    this.ctx.clearRect(0, 0, width, height);

    // Draw frequency bars
    const barWidth = width / data.length;
    const barSpacing = 1;

    this.ctx.beginPath();
    this.ctx.moveTo(0, height);

    // Draw the line connecting all frequency points
    for (let i = 0; i < data.length; i++) {
      const value = Math.max(0, Math.min(1, (data[i] + 140) / 140));
      const x = i * barWidth;
      const y = height - value * height;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }

    // Complete the path
    this.ctx.lineTo(width, height);
    this.ctx.lineTo(0, height);

    // Add line on top
    this.ctx.strokeStyle = "#A463FF";
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }
  // Keep your original drawEnvelope method
  drawEnvelope() {
    if (!this.audioEngine) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const width = this.canvas.width;
    const height = this.canvas.height;
    const padding = 20;

    // Get envelope parameters
    const attack = this.audioEngine.synth1.get().envelope.attack;
    const decay = this.audioEngine.synth1.get().envelope.decay;
    const sustain = this.audioEngine.synth1.get().envelope.sustain;
    const release = this.audioEngine.synth1.get().envelope.release;

    // Calculate total time and scaling
    const totalTime = attack + decay + 1 + release; // Add 1 second for sustain visualization
    const timeScale = (width - 2 * padding) / totalTime;
    const amplitude = height - 2 * padding;

    // Draw envelope shape
    this.ctx.beginPath();
    this.ctx.moveTo(padding, height - padding); // Start at 0

    // Attack
    this.ctx.lineTo(padding + attack * timeScale, padding);

    // Decay
    this.ctx.lineTo(
      padding + (attack + decay) * timeScale,
      padding + (1 - sustain) * amplitude
    );

    // Sustain
    this.ctx.lineTo(
      padding + (attack + decay + 1) * timeScale,
      padding + (1 - sustain) * amplitude
    );

    // Release
    this.ctx.lineTo(
      padding + (attack + decay + 1 + release) * timeScale,
      height - padding
    );

    // Style and stroke
    this.ctx.strokeStyle = "#00ED95";
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Draw labels
    this.ctx.fillStyle = "#FF99A9";
    this.ctx.font = "12px DIN";
    this.ctx.textAlign = "center";

    // Time labels
    this.ctx.fillText("A", padding + (attack * timeScale) / 2, height - 5);
    this.ctx.fillText(
      "D",
      padding + attack * timeScale + (decay * timeScale) / 2,
      height - 5
    );
    this.ctx.fillText(
      "S",
      padding + (attack + decay + 0.5) * timeScale,
      height - 5
    );
    this.ctx.fillText(
      "R",
      padding + (attack + decay + 1 + release / 2) * timeScale,
      height - 5
    );

    // Value labels
    this.ctx.textAlign = "right";
    this.ctx.fillText(
      `${attack.toFixed(2)}s`,
      padding + attack * timeScale,
      padding - 5
    );
    this.ctx.fillText(
      `${decay.toFixed(2)}s`,
      padding + (attack + decay) * timeScale,
      padding + (1 - sustain) * amplitude - 5
    );
    this.ctx.fillText(
      `${(sustain * 100).toFixed(0)}%`,
      width - padding,
      padding + (1 - sustain) * amplitude - 5
    );
    this.ctx.fillText(
      `${release.toFixed(2)}s`,
      width - padding,
      height - padding - 5
    );
  }

  startAnimation() {
    const draw = () => {
      const data = this.analyser.getValue();

      switch (this.type) {
        case "waveform":
          this.drawWaveform(data);
          break;
        case "frequency":
          this.drawFrequencySpectrum(data);
          break;
        case "envelope":
          this.drawEnvelope();
          break;
      }

      this.animationFrame = requestAnimationFrame(draw);
    };

    draw();
  }

  cleanup() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}
