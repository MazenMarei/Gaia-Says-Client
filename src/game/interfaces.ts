// Interfaces following Interface Segregation Principle
export interface IGameState {
  currentScore: number;
  highestScore: number;
  isPlaying: boolean;
  level: number;
  timeRemaining: number;
}

export interface IPlayer {
  id: string;
  username: string;
  avatar: string;
  highestScore: number;
  gamesPlayed: number;
  lastPlayed: Date;
}

export interface IGameSequence {
  sequence: number[];
  currentIndex: number;
  userInput: number[];
}

export interface IAnimatable {
  animate(): void;
  stopAnimation(): void;
}

export interface IClickable {
  onClick(): void;
  onHover?(): void;
}

export interface IGameEngine {
  startGame(): void;
  endGame(): void;
  nextLevel(): void;
  checkUserInput(planetId: number): boolean;
  getGameState(): IGameState;
}

export interface IScoreManager {
  updateScore(points: number): void;
  getHighestScore(): number;
  saveScore(playerId: string, score: number): Promise<void>;
}

export interface IPlanet extends IAnimatable, IClickable {
  id: number;
  imagePath: string;
  position: { x: number; y: number };
  isActive: boolean;
  isClickable: boolean;
}

export interface ITimer {
  start(duration: number): void;
  stop(): void;
  pause(): void;
  resume(): void;
  getTimeRemaining(): number;
  onTimeUp: () => void;
}

export interface IGameSettings {
  planetCount: number;
  baseTime: number;
  timeDecrement: number;
  pointsPerLevel: number;
  animationDuration: number;
}
