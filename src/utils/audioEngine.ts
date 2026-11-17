class EditorialAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private delayNode: DelayNode | null = null;
  private droneGain: GainNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private padOscs: OscillatorNode[] = [];
  private noiseBuffer: AudioBuffer | null = null;
  private droneStarted = false;
  private musicTimer: ReturnType<typeof setInterval> | null = null;
  private stepIndex = 0;
  private lastTickAt = 0;
  private listeners = new Set<(enabled: boolean) => void>();

  public enabled = false;

  public subscribe(listener: (enabled: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.enabled);
    }
  }

  private initContext() {
    if (typeof window === 'undefined') return;
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        void this.ctx.resume();
      }
      return;
    }

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();
    const limiter = this.ctx.createDynamicsCompressor();
    limiter.threshold.setValueAtTime(-14, this.ctx.currentTime);
    limiter.knee.setValueAtTime(16, this.ctx.currentTime);
    limiter.ratio.setValueAtTime(4, this.ctx.currentTime);
    limiter.attack.setValueAtTime(0.004, this.ctx.currentTime);
    limiter.release.setValueAtTime(0.18, this.ctx.currentTime);

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);

    this.masterGain.connect(limiter);
    limiter.connect(this.ctx.destination);

    this.musicBus = this.ctx.createGain();
    this.musicBus.gain.setValueAtTime(1.0, this.ctx.currentTime);
    this.musicBus.connect(this.masterGain);

    this.delayNode = this.ctx.createDelay(1.0);
    this.delayNode.delayTime.setValueAtTime(0.38, this.ctx.currentTime);

    const feedback = this.ctx.createGain();
    feedback.gain.setValueAtTime(0.42, this.ctx.currentTime);

    const delayTone = this.ctx.createBiquadFilter();
    delayTone.type = 'lowpass';
    delayTone.frequency.setValueAtTime(1850, this.ctx.currentTime);

    this.delayNode.connect(delayTone);
    delayTone.connect(feedback);
    feedback.connect(this.delayNode);
    delayTone.connect(this.masterGain);

    const sampleRate = this.ctx.sampleRate;
    const length = Math.floor(sampleRate * 1.2);
    const buffer = this.ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
  }

  private startDrone() {
    if (!this.ctx || !this.musicBus || this.droneStarted) return;
    this.droneStarted = true;
    const now = this.ctx.currentTime;

    this.droneFilter = this.ctx.createBiquadFilter();
    this.droneFilter.type = 'lowpass';
    this.droneFilter.frequency.setValueAtTime(480, now);
    this.droneFilter.Q.setValueAtTime(0.9, now);

    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.09, now);
    lfoGain.gain.setValueAtTime(180, now);
    lfo.connect(lfoGain);
    lfoGain.connect(this.droneFilter.frequency);
    lfo.start(now);

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.0001, now);
    this.droneGain.gain.exponentialRampToValueAtTime(0.24, now + 1.6);

    const voices: Array<{ type: OscillatorType; freq: number; level: number }> = [
      { type: 'sine', freq: 110.0, level: 0.42 },
      { type: 'triangle', freq: 164.81, level: 0.28 },
      { type: 'sine', freq: 220.5, level: 0.22 },
      { type: 'sine', freq: 329.63, level: 0.14 },
    ];

    this.padOscs = voices.map((v) => {
      const osc = this.ctx!.createOscillator();
      const vGain = this.ctx!.createGain();
      osc.type = v.type;
      osc.frequency.setValueAtTime(v.freq, now);
      vGain.gain.setValueAtTime(v.level, now);
      osc.connect(vGain);
      vGain.connect(this.droneFilter!);
      osc.start(now);
      return osc;
    });

    this.droneFilter.connect(this.droneGain);
    this.droneGain.connect(this.musicBus);
  }

  private playMusicNote(
    freq: number,
    durationSec: number,
    peakGain: number,
    waveform: OscillatorType = 'sine',
  ) {
    if (!this.ctx || !this.musicBus || !this.delayNode || !this.enabled || this.ctx.state !== 'running') {
      return;
    }
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = waveform;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(peakGain, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    osc.connect(gain);
    gain.connect(this.musicBus);
    gain.connect(this.delayNode);

    osc.start(now);
    osc.stop(now + durationSec + 0.05);
  }

  private startBackgroundMusic() {
    this.startDrone();
    if (this.musicTimer) return;

    const bassProgression = [110.0, 87.31, 73.42, 82.41];
    const fifthProgression = [164.81, 130.81, 110.0, 123.47];
    const melodyPool = [
      [220.0, 261.63, 329.63, 493.88, 659.25],
      [174.61, 220.0, 261.63, 329.63, 523.25],
      [146.83, 220.0, 261.63, 329.63, 440.0],
      [164.81, 246.94, 293.66, 392.0, 493.88],
    ];

    const scheduleStep = () => {
      if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return;
      const chordIdx = Math.floor(this.stepIndex / 4) % 4;
      const beatInBar = this.stepIndex % 4;

      if (beatInBar === 0 && this.padOscs.length >= 3) {
        const now = this.ctx.currentTime;
        this.padOscs[0].frequency.exponentialRampToValueAtTime(bassProgression[chordIdx], now + 1.2);
        this.padOscs[1].frequency.exponentialRampToValueAtTime(fifthProgression[chordIdx], now + 1.2);
        this.padOscs[2].frequency.exponentialRampToValueAtTime(bassProgression[chordIdx] * 2, now + 1.2);
      }

      const scale = melodyPool[chordIdx];
      const notePattern = [0, 2, 4, 3, 1, 4, 2, 3];
      const noteFreq = scale[notePattern[this.stepIndex % notePattern.length]];
      this.playMusicNote(noteFreq, 2.6, 0.22, 'sine');

      if (beatInBar === 0 || beatInBar === 2) {
        this.playMusicNote(bassProgression[chordIdx], 2.2, 0.16, 'triangle');
      }

      if (beatInBar === 2) {
        const shimmerFreq = scale[(this.stepIndex + 2) % scale.length] * 2;
        setTimeout(() => {
          this.playMusicNote(shimmerFreq, 2.1, 0.11, 'triangle');
        }, 420);
      }

      this.stepIndex += 1;
    };

    setTimeout(scheduleStep, 300);
    this.musicTimer = setInterval(scheduleStep, 1350);
  }

  private stopBackgroundMusic() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  public playBootChime() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    this.enabled = true;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(Math.max(0.0001, this.masterGain.gain.value), now);
    this.masterGain.gain.exponentialRampToValueAtTime(0.68, now + 0.25);

    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(110, now);
    subGain.gain.setValueAtTime(0.0001, now);
    subGain.gain.exponentialRampToValueAtTime(0.28, now + 0.4);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.9);
    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start(now);
    subOsc.stop(now + 3.0);

    const chordFilter = this.ctx.createBiquadFilter();
    chordFilter.type = 'lowpass';
    chordFilter.frequency.setValueAtTime(800, now);
    chordFilter.frequency.exponentialRampToValueAtTime(4200, now + 0.5);
    chordFilter.frequency.exponentialRampToValueAtTime(1500, now + 3.2);
    chordFilter.connect(this.masterGain);

    const notes = [220.0, 329.63, 493.88, 659.25, 880.0];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const startOffset = now + idx * 0.08;
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, startOffset);

      gain.gain.setValueAtTime(0.0001, startOffset);
      gain.gain.exponentialRampToValueAtTime(0.18, startOffset + 0.18);
      gain.gain.exponentialRampToValueAtTime(0.0001, startOffset + 3.0);

      osc.connect(gain);
      gain.connect(chordFilter);
      osc.start(startOffset);
      osc.stop(startOffset + 3.1);
    });

    this.startBackgroundMusic();
    this.notify();
  }

  public toggle() {
    if (!this.ctx) {
      this.initContext();
    }
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    this.enabled = !this.enabled;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(Math.max(0.0001, this.masterGain.gain.value), now);
    if (this.enabled) {
      if (this.ctx.state === 'suspended') {
        void this.ctx.resume();
      }
      this.masterGain.gain.exponentialRampToValueAtTime(0.68, now + 0.4);
      this.startBackgroundMusic();
      this.playWhoosh();
    } else {
      this.stopBackgroundMusic();
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    }
    this.notify();
  }

  public playMicroTick() {
    if (!this.enabled || !this.ctx || !this.masterGain || this.ctx.state !== 'running') return;
    const perfNow = performance.now();
    if (perfNow - this.lastTickAt < 65) return;
    this.lastTickAt = perfNow;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1850, now);
    osc.frequency.exponentialRampToValueAtTime(1150, now + 0.045);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.11, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.055);
  }

  public playWhoosh() {
    if (!this.enabled || !this.ctx || !this.masterGain || !this.noiseBuffer || this.ctx.state !== 'running') {
      return;
    }
    const now = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(1.8, now);
    filter.frequency.setValueAtTime(280, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + 0.25);
    filter.frequency.exponentialRampToValueAtTime(340, now + 0.55);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.22, now + 0.16);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    src.start(now);
    src.stop(now + 0.6);
  }
}

export const audioEngine = new EditorialAudioEngine();
