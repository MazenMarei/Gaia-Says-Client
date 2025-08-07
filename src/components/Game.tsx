"use client";

import { useEffect, useState, useRef } from "react";
import * as motion from "motion/react-client";
import { GameEngine } from "@/game/GameEngine";
import { IGameState } from "@/game/interfaces";
import StartGame from "./StartGame";
import Loading from "./Loading";
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

export default function Game({ user, onSignIn }: GameProps) {
  const [loading, setLoading] = useState(true);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [gameState, setGameState] = useState<IGameState>({
    currentScore: 0,
    highestScore: 0,
    isPlaying: false,
    level: 1,
    timeRemaining: 30,
  });

  const gameEngineRef = useRef<GameEngine | null>(null);

  // Function to preload images
  const preloadImages = (): Promise<void[]> => {
    const imageUrls = [
      "/assets/images/bg.webp",
      "/assets/images/logo.webp",
      "/assets/images/image-1.webp",
      "/assets/images/image-2.webp",
      "/assets/images/image-3.webp",
      "/assets/images/image-4.webp",
      "/assets/images/image-5.webp",
      "/assets/images/image-6.webp",
      "/assets/images/image-7.webp",
      "/assets/images/image-8.webp",
    ];

    const imagePromises = imageUrls.map((url, index) => {
      return new Promise<void>((resolve) => {
        const img = new window.Image();
        img.onload = () => {
          // Update loading progress
          resolve();
        };
        img.onerror = () => {
          console.warn(`Failed to load image: ${url}`);
          // Still resolve to continue loading other images
          resolve();
        };
        img.src = url;
      });
    });

    return Promise.all(imagePromises);
  };

  // Function to initialize game data
  const initializeGameData = async (): Promise<void> => {
    return new Promise((resolve) => {
      // Initialize game engine
      gameEngineRef.current = new GameEngine();

      // Set up callbacks
      gameEngineRef.current.onGameStateChange = (newState) => {
        setGameState(newState);
      };

      gameEngineRef.current.onGameEnd = (score) => {
        console.log("Game ended with score:", score);

        // Save score if user is logged in
        if (user?.playerId) {
          gameEngineRef.current?.saveScore(user.playerId);
        }
      };

      gameEngineRef.current.onSequenceStart = () => {
        console.log("Sequence started");
      };

      gameEngineRef.current.onSequenceEnd = () => {
        console.log("Sequence ended");
      }; // Simulate some initialization time
      setTimeout(resolve, 500);
    });
  };

  useEffect(() => {
    const loadAssets = async () => {
      try {
        console.log("Starting to load game assets...");

        // Load images and game data in parallel
        await Promise.all([preloadImages(), initializeGameData()]);

        console.log("All assets loaded successfully!");

        // Add a minimum loading time for better UX (optional)
        const minimumLoadingTime = 2000; // 2 seconds minimum
        const loadingStartTime = Date.now();
        const timeElapsed = Date.now() - loadingStartTime;
        const remainingTime = Math.max(0, minimumLoadingTime - timeElapsed);

        if (remainingTime > 0) {
          await new Promise((resolve) => setTimeout(resolve, remainingTime));
        }

        // Hide loading screen
        setLoading(false);

        // Small delay for loading exit animation before showing start menu
        setTimeout(() => {
          setShowStartMenu(true);
        }, 300);
      } catch (error) {
        console.error("Error loading game assets:", error);
        // Even if there's an error, we should still show the game
        setLoading(false);
        setTimeout(() => {
          setShowStartMenu(true);
        }, 300);
      }
    };

    loadAssets();

    return () => {
      // Cleanup
      gameEngineRef.current = null;
    };
  }, []);

  const handleStartGame = () => {
    setShowStartMenu(false);
    gameEngineRef.current?.startGame();
  };

  const [stars, setStars] = useState<
    Array<{ left: string; top: string; delay: string; duration: string }>
  >([]);

  useEffect(() => {
    // Generate stars on client side to avoid hydration mismatch
    const generatedStars = [...Array(50)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      duration: `${Math.random() * 3 + 2}s`,
    }));
    setStars(generatedStars);
  }, []);
  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center overflow-hidden">
      {/* Background stars effect */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70 animate-pulse"
            style={{
              left: star.left,
              top: star.top,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}
      </div>

      {/* Loading Screen with exit animation */}
      <motion.div
        initial={{ scale: 1, opacity: 1 }}
        animate={{
          scale: loading ? 1 : 0,
          opacity: loading ? 1 : 0,
          display: loading ? "block" : "none",
          position: loading ? "relative" : "absolute",
        }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
        }}
      >
        <Loading />
      </motion.div>

      {/* Start Menu with entrance animation */}
      <motion.div
        initial={{ scale: 1, opacity: 1, display: "none" }}
        animate={{
          scale: showStartMenu ? 1 : 0,
          opacity: showStartMenu ? 1 : 0,
          display: showStartMenu ? "block" : "none",
        }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
          type: "spring",
          bounce: 0.35,
        }}
        className="text-center m-4 md:m-0"
      >
        <StartGame highestScore={gameState.highestScore} />
      </motion.div>
    </div>
  );
}
