// Single Responsibility Principle - AudioManager only handles audio logic
import { IAudioManager } from "./interfaces";

export class AudioManager implements IAudioManager {
  private volume: number = 0.5;
  private audioContext: AudioContext | null = null;
  static instance: AudioManager;

  constructor() {
    // Initialize audio context on first user interaction
    this.initializeAudioContext();
  }

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private initializeAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext ||
        (window as Window & typeof globalThis).AudioContext!)();
    } catch (error) {
      console.warn("Web Audio API not supported:", error);
    }
  }

  private createTone(frequency: number, duration: number): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(
      frequency,
      this.audioContext.currentTime
    );
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      this.volume,
      this.audioContext.currentTime + 0.1
    );
    gainNode.gain.linearRampToValueAtTime(
      0,
      this.audioContext.currentTime + duration
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  playPlanetSound(planetId: number): void {
    // Different frequencies for each planet
    const frequencies = [
      261.63, // C4 - Mercury
      293.66, // D4 - Venus
      329.63, // E4 - Earth
      349.23, // F4 - Mars
      392.0, // G4 - Jupiter
      440.0, // A4 - Saturn
      493.88, // B4 - Uranus
      523.25, // C5 - Neptune
    ];

    const frequency = frequencies[planetId - 1] || 440;
    this.createTone(frequency, 0.5);
  }

  playCorrectSound(): void {
    // Pleasant ascending tone
    this.createTone(523.25, 0.2); // C5
    setTimeout(() => this.createTone(659.25, 0.2), 100); // E5
  }

  playWrongSound(): void {
    // Dissonant tone
    this.createTone(146.83, 0.5); // D3
  }

  playGameOverSound(): void {
    // Descending tone sequence
    this.createTone(392.0, 0.3); // G4
    setTimeout(() => this.createTone(349.23, 0.3), 200); // F4
    setTimeout(() => this.createTone(293.66, 0.5), 400); // D4
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }
}
