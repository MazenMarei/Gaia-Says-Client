import { IPlanet } from "./interfaces";

// Single Responsibility: Represents a single planet in the game
export class Planet implements IPlanet {
  public id: number;
  public imagePath: string;
  public position: { x: number; y: number };
  public isActive: boolean = false;
  public isClickable: boolean = true;
  private animationTimeoutId: NodeJS.Timeout | null = null;
  public onPlanetClick: ((id: number) => void) | null = null;

  constructor(
    id: number,
    position: { x: number; y: number },
    onPlanetClick?: (id: number) => void
  ) {
    this.id = id;
    this.imagePath = `/assets/images/image-${id}.webp`;
    this.position = position;
    this.onPlanetClick = onPlanetClick || null;
  }

  animate(): void {
    this.isActive = true;

    // Auto-stop animation after duration
    this.animationTimeoutId = setTimeout(() => {
      this.stopAnimation();
    }, 800);
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
      this.onPlanetClick(this.id);
    }
  }

  onHover(): void {
    // Add hover effects if needed
  }

  setClickable(clickable: boolean): void {
    this.isClickable = clickable;
  }

  // Static method to generate planet positions in a circular pattern
  static generatePlanetPositions(
    count: number,
    radius: number = 250
  ): { x: number; y: number }[] {
    const positions: { x: number; y: number }[] = [];
    const angleStep = (2 * Math.PI) / count;

    for (let i = 0; i < count; i++) {
      const angle = i * angleStep - Math.PI / 2; // Start from top
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      positions.push({ x, y });
    }

    return positions;
  }
}
