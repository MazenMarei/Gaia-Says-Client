import { AudioManager } from "@/game/AudioManager";
import { IPlanet } from "./interfaces";

// Single Responsibility: Represents a single planet in the game
export class Planet implements IPlanet {
  public id: number;
  public imagePath: string;
  public isActive: boolean = false;
  public isClickable: boolean = true;
  public isClicked: boolean = false;
  private animationTimeoutId: NodeJS.Timeout | null = null;
  public activationTick: number = 0; // NEW: increments every animate() call
  private audioManager: AudioManager = AudioManager.getInstance();
  public onPlanetClick: ((id: number) => void) | null = null;

  constructor(id: number, onPlanetClick?: (id: number) => void) {
    this.id = id;
    this.imagePath = `/assets/images/image-${id}.webp`;
    this.onPlanetClick = onPlanetClick || null;
  }

  animate(): void {
    this.isActive = true;
    this.activationTick++; // always changes, even for back-to-back calls
    
  }

  stopAnimation(): void {
    this.isActive = false;
    if (this.animationTimeoutId) {
      clearTimeout(this.animationTimeoutId);
      this.animationTimeoutId = null;
    }
  }

  onClick(): void {
    if (this.isClickable && this.onPlanetClick) {
      this.audioManager.playPlanetSound(this.id);
      this.onPlanetClick(this.id);
    }
  }

  setClickable(clickable: boolean): void {
    this.isClickable = clickable;
  }

  setClicked(clicked: boolean): void {
    this.isClicked = clicked;
  }
}
