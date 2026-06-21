"use client";

import { motion, AnimatePresence } from "motion/react";
import Card from "./Card";

interface SettingsMenuProps {
  isOpen: boolean;
  currentScore: number;
  timeRemaining: number;
  isMuted: boolean;
  onResume: () => void;
  onRestart: () => void;
  onToggleMute: () => void;
}

export default function SettingsMenu({
  isOpen,
  currentScore,
  timeRemaining,
  isMuted,
  onResume,
  onRestart,
  onToggleMute,
}: SettingsMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/30 z-50"
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
              <h2 className="mb-5 text-2xl sm:text-4xl font-bold text-cyan-400">
                ⚙️ Settings
              </h2>
            </Card.Header>

            <Card.Content>
              {/* Stats */}
              <div className="w-full flex flex-col gap-2 mb-6 text-sm md:text-base">
                <div className="flex justify-between items-center px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-gray-400">Current Score</span>
                  <span className="text-yellow-300 font-bold">{currentScore}</span>
                </div>
                <div className="flex justify-between items-center px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-gray-400">Time Remaining </span>
                  <span
                    className={`w-8 md:w-16 ms-3 font-bold ${
                      timeRemaining <= 5 ? "text-red-400" : "text-cyan-300"
                    }`}
                  >
                    {timeRemaining}<span className="text-gray-400 ms-1 text-xs">s</span>
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 w-full">
                <SettingsButton
                  onClick={onResume}
                  color="cyan"
                >
                  ▶ Resume
                </SettingsButton>

                <SettingsButton
                  onClick={onToggleMute}
                  color="purple"
                >
                  {isMuted ? "🔇 Unmute Sound" : "🔊 Mute Sound"}
                </SettingsButton>

                <SettingsButton
                  onClick={onRestart}
                  color="red"
                >
                  ✕ End Game
                </SettingsButton>
              </div>
            </Card.Content>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SettingsButton({
  children,
  onClick,
  color,
}: {
  children: React.ReactNode;
  onClick: () => void;
  color: "cyan" | "yellow" | "red" | "purple";
}) {
  const styles = {
    cyan:   "bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border-cyan-500/30",
    yellow: "bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 border-yellow-500/30",
    red:    "bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30",
    purple: "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border-purple-500/30",
  };

  return (
    <motion.button
      className={`w-full px-4 py-2 rounded-md border font-medium text-sm md:text-base hover:cursor-pointer transition-colors ${styles[color]}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 300,
        bounce: 0.25,
        duration: 0.3,
      }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}