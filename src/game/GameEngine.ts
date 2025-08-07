import { IGameEngine, IGameState, IGameSequence } from "./interfaces";
import { GameSettings, GameTimer, ScoreManager } from "./GameManagers";
import { Planet } from "./Planet";

// Single Responsibility: Manages the main game logic
export class GameEngine implements IGameEngine {
  private gameState: IGameState;
  private gameSequence: IGameSequence;
  private planets: Planet[];
  private timer: GameTimer;
  private scoreManager: ScoreManager;
  private settings: GameSettings;
  private sequenceTimeoutIds: NodeJS.Timeout[] = [];

  // Event callbacks
  public onGameStateChange: ((state: IGameState) => void) | null = null;
  public onGameEnd: ((finalScore: number) => void) | null = null;
  public onSequenceStart: (() => void) | null = null;
  public onSequenceEnd: (() => void) | null = null;

  constructor(settings?: GameSettings) {
    this.settings = settings || new GameSettings();
    this.timer = new GameTimer();
    this.scoreManager = new ScoreManager();

    this.gameState = {
      currentScore: 0,
      highestScore: this.scoreManager.getHighestScore(),
      isPlaying: false,
      level: 1,
      timeRemaining: this.settings.baseTime,
    };

    this.gameSequence = {
      sequence: [],
      currentIndex: 0,
      userInput: [],
    };

    // Initialize planets
    this.planets = this.initializePlanets();

    // Setup timer callbacks
    this.timer.onTimeUp = () => this.endGame();
    this.timer.onTick = (time) => {
      this.gameState.timeRemaining = time;
      this.notifyStateChange();
    };
  }

  private initializePlanets(): Planet[] {
    const positions = Planet.generatePlanetPositions(this.settings.planetCount);
    return positions.map(
      (pos, index) =>
        new Planet(index + 1, pos, (id) => this.handlePlanetClick(id))
    );
  }

  startGame(): void {
    this.resetGame();
    this.gameState.isPlaying = true;
    this.generateNextSequence();
    this.playSequence();
    this.startTimer();
    this.notifyStateChange();
  }

  endGame(): void {
    this.gameState.isPlaying = false;
    this.timer.stop();
    this.clearSequenceTimeouts();
    this.setPlanetsClickable(false);

    const finalScore = this.gameState.currentScore;
    this.onGameEnd?.(finalScore);
    this.notifyStateChange();
  }

  nextLevel(): void {
    this.gameState.level++;
    this.generateNextSequence();
    this.playSequence();
    this.startTimer();
    this.notifyStateChange();
  }

  checkUserInput(planetId: number): boolean {
    const expectedId =
      this.gameSequence.sequence[this.gameSequence.currentIndex];

    if (planetId === expectedId) {
      this.gameSequence.currentIndex++;

      // Check if sequence is complete
      if (this.gameSequence.currentIndex >= this.gameSequence.sequence.length) {
        this.onSequenceComplete();
        return true;
      }
      return true;
    } else {
      // Wrong input - end game
      this.endGame();
      return false;
    }
  }

  getGameState(): IGameState {
    return { ...this.gameState };
  }

  getPlanets(): Planet[] {
    return this.planets;
  }

  private resetGame(): void {
    this.scoreManager.resetCurrentScore();
    this.gameState = {
      currentScore: 0,
      highestScore: this.scoreManager.getHighestScore(),
      isPlaying: false,
      level: 1,
      timeRemaining: this.settings.baseTime,
    };

    this.gameSequence = {
      sequence: [],
      currentIndex: 0,
      userInput: [],
    };
  }

  private generateNextSequence(): void {
    // Add one more planet to the sequence
    const randomPlanetId =
      Math.floor(Math.random() * this.settings.planetCount) + 1;
    this.gameSequence.sequence.push(randomPlanetId);
    this.gameSequence.currentIndex = 0;
  }

  private playSequence(): void {
    this.setPlanetsClickable(false);
    this.onSequenceStart?.();

    this.gameSequence.sequence.forEach((planetId, index) => {
      const timeout = setTimeout(() => {
        const planet = this.planets.find((p) => p.id === planetId);
        planet?.animate();

        // If this is the last planet in sequence, enable clicking
        if (index === this.gameSequence.sequence.length - 1) {
          setTimeout(() => {
            this.setPlanetsClickable(true);
            this.onSequenceEnd?.();
          }, this.settings.animationDuration);
        }
      }, index * (this.settings.animationDuration + 200));

      this.sequenceTimeoutIds.push(timeout);
    });
  }

  private handlePlanetClick(planetId: number): void {
    if (!this.gameState.isPlaying) return;

    const planet = this.planets.find((p) => p.id === planetId);
    planet?.animate();

    this.checkUserInput(planetId);
  }

  private onSequenceComplete(): void {
    // Award points
    const points = this.settings.pointsPerLevel * this.gameState.level;
    this.scoreManager.updateScore(points);
    this.gameState.currentScore = this.scoreManager.getCurrentScore();
    this.gameState.highestScore = this.scoreManager.getHighestScore();

    // Stop current timer
    this.timer.stop();

    // Small delay before next level
    setTimeout(() => {
      this.nextLevel();
    }, 1000);
  }

  private startTimer(): void {
    const timeForLevel = Math.max(
      this.settings.baseTime -
        (this.gameState.level - 1) * this.settings.timeDecrement,
      10 // Minimum 10 seconds
    );
    this.gameState.timeRemaining = timeForLevel;
    this.timer.start(timeForLevel);
  }

  private setPlanetsClickable(clickable: boolean): void {
    this.planets.forEach((planet) => planet.setClickable(clickable));
  }

  private clearSequenceTimeouts(): void {
    this.sequenceTimeoutIds.forEach((id) => clearTimeout(id));
    this.sequenceTimeoutIds = [];
  }

  private notifyStateChange(): void {
    this.onGameStateChange?.(this.getGameState());
  }

  // Method to save score when game ends
  async saveScore(playerId: string): Promise<void> {
    if (this.gameState.currentScore > 0) {
      await this.scoreManager.saveScoreToDatabase(
        playerId,
        this.gameState.currentScore
      );
    }
  }
}
