"use client";

import { IGameState } from "@/game/interfaces";

interface GameUIProps {
  gameState: IGameState;
  onStartGame: () => void;
  onEndGame: () => void;
  isSequencePlaying: boolean;
}

export default function GameUI({
  gameState,
  onStartGame,
  onEndGame,
  isSequencePlaying,
}: GameUIProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="absolute top-4 left-4 right-4 z-10">
      {/* Top UI Bar */}
      <div className="flex justify-between items-center">
        {/* Left side - Scores */}
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
          <div className="text-sm opacity-80">Score</div>
          <div
            className={`text-2xl font-bold text-yellow-400 transition-transform ${
              gameState.currentScore > 0 ? "animate-pulse" : ""
            }`}
          >
            {gameState.currentScore.toLocaleString()}
          </div>
          <div className="text-xs opacity-60">
            Best: {gameState.highestScore.toLocaleString()}
          </div>
        </div>

        {/* Center - Level */}
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-center">
          <div className="text-sm opacity-80">Level</div>
          <div
            className={`text-2xl font-bold text-cyan-400 transition-transform ${
              gameState.level > 1 ? "animate-bounce" : ""
            }`}
          >
            {gameState.level}
          </div>
        </div>

        {/* Right side - Timer */}
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-right">
          <div className="text-sm opacity-80">Time</div>
          <div
            className={`text-2xl font-bold transition-colors ${
              gameState.timeRemaining <= 10
                ? "text-red-400 animate-pulse"
                : "text-green-400"
            }`}
          >
            {formatTime(gameState.timeRemaining)}
          </div>
        </div>
      </div>

      {/* Game Status Messages */}
      <div className="flex justify-center mt-4">
        {isSequencePlaying && (
          <div className="bg-blue-600/80 backdrop-blur-sm rounded-lg px-6 py-3 text-white font-semibold">
            Watch the sequence...
          </div>
        )}

        {!gameState.isPlaying && !isSequencePlaying && (
          <div className="text-center">
            <button
              onClick={onStartGame}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState.isPlaying && !isSequencePlaying && (
          <div className="bg-green-600/80 backdrop-blur-sm rounded-lg px-6 py-3 text-white font-semibold">
            Your turn! Click the planets in order
          </div>
        )}
      </div>

      {/* End Game Button */}
      {gameState.isPlaying && (
        <div className="absolute top-0 right-0">
          <button
            onClick={onEndGame}
            className="bg-red-600/80 hover:bg-red-700/80 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
          >
            End Game
          </button>
        </div>
      )}
    </div>
  );
}
