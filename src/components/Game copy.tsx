"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { GameEngine } from "@/game/GameEngine";
import { IGameState } from "@/game/interfaces";
import PlanetComponent from "./PlanetComponent";
import GameUI from "./GameUI";
import Header from "./Header";

interface GameProps {
  user?: {
    name?: string;
    image?: string;
    playerId?: string;
    highestScore?: number;
  } | null;
  onSignIn: () => void;
  onSignOut: () => void;
}

export default function Game({ user, onSignIn, onSignOut }: GameProps) {
  const [gameState, setGameState] = useState<IGameState>({
    currentScore: 0,
    highestScore: 0,
    isPlaying: false,
    level: 1,
    timeRemaining: 30,
  });
  const [isSequencePlaying, setIsSequencePlaying] = useState(false);
  const [gameOverModal, setGameOverModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const gameEngineRef = useRef<GameEngine | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize game engine
    gameEngineRef.current = new GameEngine();

    // Set up callbacks
    gameEngineRef.current.onGameStateChange = (newState) => {
      setGameState(newState);
    };

    gameEngineRef.current.onGameEnd = (score) => {
      setFinalScore(score);
      setGameOverModal(true);
      setIsSequencePlaying(false);

      // Save score if user is logged in
      if (user?.playerId) {
        gameEngineRef.current?.saveScore(user.playerId);
      }
    };

    gameEngineRef.current.onSequenceStart = () => {
      setIsSequencePlaying(true);
    };

    gameEngineRef.current.onSequenceEnd = () => {
      setIsSequencePlaying(false);
    };

    return () => {
      // Cleanup
      gameEngineRef.current = null;
    };
  }, [user]);

  const handleStartGame = () => {
    gameEngineRef.current?.startGame();
    setGameOverModal(false);
  };

  const handleEndGame = () => {
    gameEngineRef.current?.endGame();
  };

  const closeGameOverModal = () => {
    setGameOverModal(false);
  };

  const getGameContainerCenter = () => {
    if (gameContainerRef.current) {
      const rect = gameContainerRef.current.getBoundingClientRect();
      return {
        x: rect.width / 2,
        y: rect.height / 2,
      };
    }
    return { x: 400, y: 300 }; // Default center
  };

  const center = getGameContainerCenter();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/assets/images/bg.webp"
          alt="Space Background"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Header */}
      <Header user={user} onSignIn={onSignIn} onSignOut={onSignOut} />

      {/* Game UI */}
      <GameUI
        gameState={gameState}
        onStartGame={handleStartGame}
        onEndGame={handleEndGame}
        isSequencePlaying={isSequencePlaying}
      />

      {/* Game Container */}
      <div
        ref={gameContainerRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        {/* Central Sun/Star */}
        <motion.div
          className="absolute w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 10, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-gradient-radial from-yellow-400 via-orange-500 to-red-600 rounded-full animate-pulse" />
            <div className="absolute inset-2 bg-gradient-radial from-yellow-200 via-yellow-400 to-orange-500 rounded-full" />
            <div className="absolute inset-4 bg-gradient-radial from-white via-yellow-200 to-yellow-400 rounded-full" />
          </div>
        </motion.div>

        {/* Planets */}
        {gameEngineRef.current?.getPlanets().map((planet) => (
          <PlanetComponent
            key={planet.id}
            planet={planet}
            centerX={center.x}
            centerY={center.y}
          />
        ))}

        {/* Orbital paths */}
        <motion.div
          className="absolute border border-blue-300/20 rounded-full"
          style={{
            width: 520,
            height: 520,
            left: center.x - 260,
            top: center.y - 260,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="absolute border border-purple-300/10 rounded-full"
          style={{
            width: 600,
            height: 600,
            left: center.x - 300,
            top: center.y - 300,
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Game Over Modal */}
      {gameOverModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeGameOverModal}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-gray-700 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Game Over!</h2>
              <div className="text-6xl mb-4">🚀</div>
              <div className="mb-6">
                <div className="text-gray-400 text-sm">Final Score</div>
                <div className="text-4xl font-bold text-yellow-400">
                  {finalScore.toLocaleString()}
                </div>
              </div>
              <div className="mb-6">
                <div className="text-gray-400 text-sm">Level Reached</div>
                <div className="text-2xl font-bold text-cyan-400">
                  {gameState.level}
                </div>
              </div>
              <div className="space-y-3">
                <motion.button
                  onClick={handleStartGame}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Play Again
                </motion.button>
                <motion.button
                  onClick={closeGameOverModal}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
