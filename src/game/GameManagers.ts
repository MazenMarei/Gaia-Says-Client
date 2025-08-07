import { IGameSettings } from "./interfaces";

// Single Responsibility: Manages game configuration
export class GameSettings implements IGameSettings {
  public readonly planetCount = 8;
  public readonly baseTime = 30;
  public readonly timeDecrement = 2;
  public readonly pointsPerLevel = 100;
  public readonly animationDuration = 800;

  constructor(customSettings?: Partial<IGameSettings>) {
    if (customSettings) {
      Object.assign(this, customSettings);
    }
  }
}

// Single Responsibility: Manages game timing
export class GameTimer {
  private timeRemaining: number = 0;
  private intervalId: NodeJS.Timeout | null = null;
  private isPaused: boolean = false;
  public onTimeUp: (() => void) | null = null;
  public onTick: ((time: number) => void) | null = null;

  start(duration: number): void {
    this.timeRemaining = duration;
    this.isPaused = false;
    this.intervalId = setInterval(() => {
      if (!this.isPaused && this.timeRemaining > 0) {
        this.timeRemaining--;
        this.onTick?.(this.timeRemaining);

        if (this.timeRemaining === 0) {
          this.stop();
          this.onTimeUp?.();
        }
      }
    }, 1000);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  pause(): void {
    this.isPaused = true;
  }

  resume(): void {
    this.isPaused = false;
  }

  getTimeRemaining(): number {
    return this.timeRemaining;
  }
}

// Single Responsibility: Manages scoring logic
export class ScoreManager {
  private currentScore: number = 0;
  private highestScore: number = 0;

  constructor() {
    this.loadHighestScore();
  }

  updateScore(points: number): void {
    this.currentScore += points;
    if (this.currentScore > this.highestScore) {
      this.highestScore = this.currentScore;
      this.saveHighestScore();
    }
  }

  getCurrentScore(): number {
    return this.currentScore;
  }

  getHighestScore(): number {
    return this.highestScore;
  }

  resetCurrentScore(): void {
    this.currentScore = 0;
  }

  private loadHighestScore(): void {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gaia-says-highest-score");
      this.highestScore = saved ? parseInt(saved) : 0;
    }
  }

  private saveHighestScore(): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "gaia-says-highest-score",
        this.highestScore.toString()
      );
    }
  }

  async saveScoreToDatabase(playerId: string, score: number): Promise<void> {
    try {
      await fetch("/api/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playerId, score }),
      });
    } catch (error) {
      console.error("Failed to save score to database:", error);
    }
  }
}
