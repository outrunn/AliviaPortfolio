export interface AudioData {
  bass: number;
  mid: number;
  treble: number;
  volume: number;
  frequencies: Uint8Array;
}

const EMPTY_AUDIO: AudioData = {
  bass: 0,
  mid: 0,
  treble: 0,
  volume: 0,
  frequencies: new Uint8Array(64),
};

export class AudioEngine {
  private context: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private buffer: AudioBuffer | null = null;
  private frequencyData: Uint8Array = new Uint8Array(64);
  private _isPlaying = false;
  private startOffset = 0;
  private startTime = 0;
  private loadedSrc: string | null = null;

  get isPlaying() {
    return this._isPlaying;
  }

  async load(src: string): Promise<void> {
    if (this.loadedSrc === src && this.buffer) return;

    if (!this.context) {
      this.context = new AudioContext();
      this.analyser = this.context.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.8;
      this.gainNode = this.context.createGain();
      this.gainNode.connect(this.analyser);
      this.analyser.connect(this.context.destination);
      this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    }

    this.stop();
    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    this.buffer = await this.context.decodeAudioData(arrayBuffer);
    this.loadedSrc = src;
    this.startOffset = 0;
  }

  play(): void {
    if (!this.context || !this.buffer || !this.analyser || !this.gainNode) return;
    if (this._isPlaying) return;

    if (this.context.state === "suspended") {
      this.context.resume();
    }

    this.source = this.context.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.connect(this.gainNode);
    this.source.onended = () => {
      if (this._isPlaying) {
        this._isPlaying = false;
        this.startOffset = 0;
      }
    };
    this.source.start(0, this.startOffset);
    this.startTime = this.context.currentTime;
    this._isPlaying = true;
  }

  pause(): void {
    if (!this.context || !this.source || !this._isPlaying) return;
    this.startOffset += this.context.currentTime - this.startTime;
    this.source.stop();
    this.source.disconnect();
    this.source = null;
    this._isPlaying = false;
  }

  stop(): void {
    if (this.source) {
      try {
        this.source.stop();
        this.source.disconnect();
      } catch {
        // already stopped
      }
      this.source = null;
    }
    this._isPlaying = false;
    this.startOffset = 0;
  }

  toggle(): void {
    if (this._isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  getAudioData(): AudioData {
    if (!this.analyser || !this._isPlaying) return EMPTY_AUDIO;

    this.analyser.getByteFrequencyData(this.frequencyData);

    const len = this.frequencyData.length;
    const third = Math.floor(len / 3);

    let bassSum = 0;
    for (let i = 0; i < third; i++) bassSum += this.frequencyData[i];
    const bass = bassSum / third / 255;

    let midSum = 0;
    for (let i = third; i < third * 2; i++) midSum += this.frequencyData[i];
    const mid = midSum / third / 255;

    let trebleSum = 0;
    for (let i = third * 2; i < len; i++) trebleSum += this.frequencyData[i];
    const treble = trebleSum / (len - third * 2) / 255;

    const volume = (bass + mid + treble) / 3;

    return { bass, mid, treble, volume, frequencies: this.frequencyData };
  }

  getCurrentTime(): number {
    if (!this.context || !this._isPlaying) return this.startOffset;
    return this.startOffset + (this.context.currentTime - this.startTime);
  }

  getDuration(): number {
    return this.buffer?.duration ?? 0;
  }

  destroy(): void {
    this.stop();
    if (this.context) {
      this.context.close();
      this.context = null;
    }
  }
}
