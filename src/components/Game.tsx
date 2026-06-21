"use client";

import { useEffect, useState, useRef, useReducer } from "react";
import { motion } from "motion/react";
import { GameEngine } from "@/game/GameEngine";
import { IGameState } from "@/game/interfaces";
import StartGame from "./StartGame";
import Loading from "./Loading";
import Header from "./Header";
import Image from "next/image";
import PlanetComponent from "./PlanetComponent";
import Card from "./Card";
import SettingsMenu from "./SettingMenu";
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
  const [showGameArea, setShowGameArea] = useState(false);

  const [isSequencePlaying, setIsSequencePlaying] = useState(false);
  const [gameOverModal, setGameOverModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const [gameState, setGameState] = useState<IGameState>({
    currentScore: 0,
    highestScore: 0,
    isPlaying: false,
    level: 1,
    timeRemaining: 30,
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  // Function to preload images
  const preloadImages = (): Promise<void[]> => {
    const imageUrls = [
      "/assets/images/bg.webp",
      "/assets/images/logo.webp",
      "/assets/images/image-0.webp",
      "/assets/images/image-1.webp",
      "/assets/images/image-2.webp",
      "/assets/images/image-3.webp",
      "/assets/images/image-4.webp",
      "/assets/images/image-5.webp",
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
        setIsSequencePlaying(false);
        setGameOverModal(true);
        setFinalScore(score);

        // Save score if user is logged in
        if (user?.playerId) {
          gameEngineRef.current?.saveScore(user.playerId);
        }
      };

      gameEngineRef.current.onSequenceStart = () => {
        console.log("Sequence started");
        setIsSequencePlaying(true);
      };

      gameEngineRef.current.onSequenceEnd = () => {
        setIsSequencePlaying(false);
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

  useEffect(() => {
    if (gameEngineRef.current) {
      gameEngineRef.current.onPlanetAnimate = () => forceUpdate();
      gameEngineRef.current.onPlanetStopAnimate = () => forceUpdate();
    }
  }, [gameEngineRef]);

  const handleSettingsClicked = () => {
    if (!gameState.isPlaying) return;
    setIsSettingsOpen(true);
    gameEngineRef.current?.pause();
    forceUpdate();
  };
  const handleStartGame = () => {
    setShowStartMenu(false);
    setIsSettingsOpen(false);
    setTimeout(() => {
      setShowGameArea(true);

      setTimeout(() => {
        gameEngineRef.current?.startGame();
        forceUpdate();
      }, 300);
    }, 300);
  };

  const handleMuteToggle = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.toggleMute();
      forceUpdate();
    }
  };

  const handleResume = () => {
    setIsSettingsOpen(false);
    gameEngineRef.current?.resume(isSequencePlaying);
    forceUpdate();
  };

  const handleRestart = () => {
    setShowGameArea(false);
    setIsSettingsOpen(false);
    gameEngineRef.current?.endGame();
    setGameOverModal(false);
    setTimeout(() => {
      setShowStartMenu(true);
      forceUpdate();
    }, 300);
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
    <div
      style={{
        backgroundImage: "url('/assets/images/bg.webp')",
      }}
    >
      {/* bg-gradient-to-br from-slate-900/50 via-purple-900/50 to-slate-900/50 */}
      <div className="fixed inset-0 w-full h-full  flex flex-col items-center justify-between overflow-hidden">
        <div className="z-1 w-full">
          {/* Navbar  */}

          <motion.div
            initial={{ scaleX: 1, opacity: 0 }}
            animate={{
              scaleX: !loading ? 1 : 0,
              opacity: !loading ? 1 : 0,
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              type: "spring",
              bounce: 0.35,
            }}
            className="origin-center p-3 m-3 relative bg-background/80 backdrop-blur-sm text-center bg-card/30 rounded-2xl border border-cyan-300/30 shadow-2xl"
          >
            <Header
              gameState={gameState}
              onSettingsClicked={handleSettingsClicked}
            />
          </motion.div>
        </div>
        {/* Main Game Area */}
        <div className="z-1 flex-1 flex items-center justify-center w-full h-full">
          {/* Loading Screen with exit animation */}
          {loading && (
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
          )}

          {/* Start Menu with entrance animation */}
          {!loading && !showGameArea && (
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
              className="text-center m-4 md:m-0 z-1 absolute"
            >
              <StartGame
                highestScore={gameState.highestScore}
                handleStartGame={handleStartGame}
              />
            </motion.div>
          )}

          {/* Main Game Area */}
          <motion.div
            initial={{ scale: 0, opacity: 0, display: "none" }}
            animate={{
              scale: showGameArea ? 1 : 0,
              opacity: showGameArea ? 1 : 0,
              display: showGameArea ? "block" : "none",
            }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
              type: "spring",
              bounce: 0.25,
            }}
            className="pointer-events-none"
          >
            {/* Sun */}
            <div className="flex items-center justify-center flex-col w-full h-full relative transition-all duration-300">
              {/* Rotating rays */}
              <div
                className="absolute z-0 origin-center w-16 h-16  sm:w-24 sm:h-24 lg:w-32 lg:h-32 animate-spin origin-mark transition-all duration-300"
                style={{ animationDuration: "30s" }}
              >
                <div className="absolute shadow-[0px_0px_20px_rgba(0,0,0,0.1)] shadow-green-400/50 rounded-full w-16 h-16  sm:w-24 sm:h-24 lg:w-32 lg:h-32 animate-pulse transition-all duration-300"></div>
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute z-0 w-1 h-8 bg-gradient-to-t from-purple-400/60 to-transparent origin-[0%_3.3rem]  md:origin-[0%_4.3rem] lg:origin-[0%_5.3rem] bottom-[90%] left-[50%]"
                    style={{
                      transform: `translateX(-50%) rotate(${i * 45}deg)`,
                    }}
                  />
                ))}
              </div>

              <Image
                src={"/assets/images/logo.webp"}
                alt="Game Sun"
                width={256}
                height={256}
                className="w-16 h-16 sm:w-26 sm:h-26 lg:w-32 lg:h-32 z-1 transition-all duration-300"
                priority
              />

              {[...Array(3)].map((_, i) => (
                <div
                  className={`mazen-test pointer-events-none absolute w-${35 + i * 25} h-${
                    35 + i * 25
                  } md:w-${80 + i * 60} md:h-${80 + i * 60} sm:w-${
                    70 + i * 35
                  } sm:h-${
                    70 + i * 35
                  } rounded-full border-2 border-solid border-gray-300/20 transition-all duration-300 ${
                    gameState.isPlaying && gameState.currentScore > 3
                      ? "animate-spin"
                      : ""
                  }`}
                  style={{
                    animationDuration: `${20 + (6 - i) < 0 ? 0 : (6 - i) * 10}s`,
                  }}
                  key={i}
                >
                  {gameEngineRef.current
                    ?.getPlanets()
                    .slice(i * 2, i * 2 + 2)
                    .map((planet, index) => (
                      <PlanetComponent
                        key={planet.id}
                        planet={planet}
                        isSequencePlaying={isSequencePlaying}
                        position={
                          i % 2 !== 0
                            ? index % 2 === 0
                              ? "left"
                              : "right"
                            : index % 2 === 0
                              ? "bottom"
                              : "top"
                        }
                      />
                    ))}
                </div>
              ))}
              {/* orbit  */}
              <div
                className="pointer-events-none absolute w-47 h-47 md:w-110 md:h-110 sm:w-87 sm:h-87 rounded-full border-2 border-solid border-gray-300/20 transition-all duration-300 animate-spin"
                style={{ animationDuration: "40s" }}
              ></div>
              {/* orbit  */}
              <div
                className="pointer-events-none absolute w-72 h-72 md:w-170 md:h-170 sm:w-117 sm:h-117 rounded-full border-2 border-solid border-gray-300/20 transition-all duration-300 animate-spin"
                style={{ animationDuration: "40s" }}
              ></div>
            </div>
          </motion.div>
        </div>

        {/* Game over model */}
        {!gameState.isPlaying && gameOverModal && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/30 z-2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
              type: "spring",
              bounce: 0.25,
            }}
          >
            <Card>
              <Card.Header>
                <h2 className="text-2xl font-bold text-red-400">Game Over!</h2>
              </Card.Header>
              <Card.Content>
                <div className="text-white text-center">
                  <p className="mt-2">
                    Your final score <br />{" "}
                    <span className="text-yellow-400">
                      {gameState.currentScore}
                    </span>
                  </p>
                  <motion.button
                    className="mt-4 px-4 py-2 bg-red-500/80 rounded hover:cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                      type: "spring",
                      bounce: 0.25,
                    }}
                    onClick={handleRestart}
                  >
                    🔁 Restart
                  </motion.button>
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        )}

        {/* Settings Panel */}
        {gameState.isPlaying && isSettingsOpen && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/30 z-2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
              type: "spring",
              bounce: 0.25,
            }}
          >
            <SettingsMenu
              isOpen={isSettingsOpen}
              currentScore={gameState.currentScore}
              timeRemaining={gameState.timeRemaining}
              isMuted={gameEngineRef.current?.isMuted() || false}
              onResume={handleResume}
              onRestart={handleRestart}
              onToggleMute={handleMuteToggle}
            />
          </motion.div>
        )}
        {/* Background stars effect */}
        <div className="absolute inset-0 overflow-hidden z-0">
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
      </div>
    </div>
  );
}
