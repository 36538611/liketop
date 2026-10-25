/**
 * Web Audio API Synth Engine for LikeTop
 * Provides zero-network, 100% reliable synthesized background beats
 * for short-form video playback without CORS or 403 errors.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private intervalId: number | null = null;
  private currentTrack = '';

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTrack(trackName: string) {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.isPlaying = true;
    this.currentTrack = trackName;
    const ctx = this.ctx;

    // Base frequencies based on track vibe
    let bassFreq = 65.41; // C2
    let tempoMs = 400; // 150 BPM

    if (trackName.includes('Drift') || trackName.includes('Phonk')) {
      bassFreq = 55.0; // A1 (deep phonk)
      tempoMs = 380;
    } else if (trackName.includes('Electric') || trackName.includes('Beat')) {
      bassFreq = 73.42; // D2
      tempoMs = 340;
    } else if (trackName.includes('Blade') || trackName.includes('Ambient')) {
      bassFreq = 43.65; // F1
      tempoMs = 600;
    }

    let step = 0;
    this.intervalId = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx) return;

      const now = ctx.currentTime;

      // 1. Bass synth note
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = step % 4 === 0 ? 'sawtooth' : 'triangle';
      const notes = [bassFreq, bassFreq * 1.25, bassFreq * 1.5, bassFreq * 0.8];
      osc.frequency.setValueAtTime(notes[step % notes.length], now);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (tempoMs / 1000) * 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + (tempoMs / 1000));

      // 2. High sparkle hi-hat / melody note
      if (step % 2 === 0) {
        const hiOsc = ctx.createOscillator();
        const hiGain = ctx.createGain();
        hiOsc.type = 'sine';
        hiOsc.frequency.setValueAtTime(bassFreq * 8 * (1 + (step % 3) * 0.2), now);

        hiGain.gain.setValueAtTime(0.02, now);
        hiGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

        hiOsc.connect(hiGain);
        hiGain.connect(ctx.destination);
        hiOsc.start(now);
        hiOsc.stop(now + 0.15);
      }

      step++;
    }, tempoMs);
  }

  stop() {
    this.isPlaying = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getPlaying() {
    return this.isPlaying;
  }
}

export const soundEngine = new SoundEngine();
