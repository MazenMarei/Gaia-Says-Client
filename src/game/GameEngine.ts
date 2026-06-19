import { IGameEngine, IGameState, IGameSequence } from "./interfaces";
import { GameSettings, GameTimer, ScoreManager } from "./GameManagers";
import { Planet } from "./Planet";
import { AudioManager } from "./AudioManager";

export class GameEngine implements IGameEngine {
  private gameState: IGameState;
  private gameSequence: IGameSequence;
  private planets: Planet[];
  private timer: GameTimer;
  private scoreManager: ScoreManager;
  private settings: GameSettings;
  private audioManager: AudioManager = AudioManager.getInstance();

  // NEW: replaces sequenceTimeoutIds entirely
  private sequenceRunId: number = 0;

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

    this.planets = this.initializePlanets();

    this.timer.onTimeUp = () => this.endGame();
    this.timer.onTick = (time) => {
      this.gameState.timeRemaining = time;
      this.notifyStateChange();
    };
  }

  private initializePlanets(): Planet[] {
    return Array.from({ length: this.settings.planetCount }, (_, index) => {
      return new Planet(index, (id) => this.handlePlanetClick(id));
    });
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
    this.invalidateSequence(); // NEW: kills any in-flight sequence loop
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

      if (this.gameSequence.currentIndex >= this.gameSequence.sequence.length) {
        this.onSequenceComplete();
        return true;
      }
      return true;
    } else {
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
    this.invalidateSequence(); // NEW: cancel any leftover sequence from a prior game
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
    const randomPlanetId = Math.floor(
      Math.random() * this.settings.planetCount,
    );
    this.gameSequence.sequence.push(randomPlanetId);
    this.gameSequence.currentIndex = 0;
  }

  // NEW: cancellation primitives
  private invalidateSequence(): void {
    this.sequenceRunId++;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // REPLACED: async loop instead of nested setTimeout chains
  private async playSequence(): Promise<void> {
    const runId = ++this.sequenceRunId; // this run's identity

    this.setPlanetsClickable(false);
    this.setPlanetsClicked(false);
    this.onSequenceStart?.();

    for (let index = 0; index < this.gameSequence.sequence.length; index++) {
      const planetId = this.gameSequence.sequence[index];
      const planet = this.planets.find((p) => p.id === planetId);

      this.audioManager.playPlanetSound(planetId);
      planet?.animate();
      this.onPlanetAnimate?.(planetId); // NEW: notify immediately

      await this.sleep(this.settings.animationDuration);
      if (runId !== this.sequenceRunId) return; // cancelled mid-flight

      planet?.stopAnimation();
      this.onPlanetStopAnimate?.(planetId); // NEW: notify immediately

      await this.sleep(600);
      if (runId !== this.sequenceRunId) return; // cancelled mid-flight
    }

    this.setPlanetsClickable(true);
    this.onSequenceEnd?.();
  }

  private handlePlanetClick(planetId: number): void {
    if (!this.gameState.isPlaying) return;

    const planet = this.planets.find((p) => p.id === planetId);
    planet?.setClicked(true);
    this.checkUserInput(planetId);
  }

  private onSequenceComplete(): void {
    const points = this.settings.pointsPerLevel * this.gameState.level;
    this.scoreManager.updateScore(points);
    this.gameState.currentScore = this.scoreManager.getCurrentScore();
    this.gameState.highestScore = this.scoreManager.getHighestScore();

    this.timer.stop();

    // still fine to use a single sleep here, but let's stay consistent and cancellation-safe
    this.delayedNextLevel();
  }

  private async delayedNextLevel(): Promise<void> {
    const runId = this.sequenceRunId;
    await this.sleep(1000);
    if (runId !== this.sequenceRunId) return; // game was reset/ended meanwhile
    this.nextLevel();
  }

  private startTimer(): void {
    const timeForLevel = Math.max(
      this.settings.baseTime -
        (this.gameState.level - 1) * this.settings.timeDecrement,
      10,
    );
    this.gameState.timeRemaining = timeForLevel;
    this.timer.start(timeForLevel);
  }

  private setPlanetsClickable(clickable: boolean): void {
    this.planets.forEach((planet) => {
      planet.setClickable(clickable);
    });
  }

  private setPlanetsClicked(clicked: boolean): void {
    this.planets.forEach((planet) => {
      planet.setClicked(clicked);
    });
  }

  private notifyStateChange(): void {
    this.onGameStateChange?.(this.getGameState());
  }

  async saveScore(playerId: string): Promise<void> {
    if (this.gameState.currentScore > 0) {
      await this.scoreManager.saveScoreToDatabase(
        playerId,
        this.gameState.currentScore,
      );
    }
  }

  public onPlanetAnimate: ((planetId: number) => void) | null = null;
  public onPlanetStopAnimate: ((planetId: number) => void) | null = null;
}
