"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Settings, Star, Timer, Trophy } from "lucide-react";
import { IGameState } from "@/game/interfaces";
import { useState } from "react";
interface HeaderProps {
  gameState: IGameState;
  onSettingsClicked: () => void;
}

export default function Header({ gameState, onSettingsClicked }: HeaderProps) {
  return (
    <header>
      <div className="flex justify-between items-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut", bounce: 0.25 }}
        >
          <div
            className="flex  items-center  space-x-3"
            style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
          >
            <div
              className="relative w-16 h-16"
              style={{ animationDuration: "20s" }}
            >
              <Image
                src="/assets/images/logo.webp"
                alt="Gaia Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="text-white text-start">
              <h1 className="text-sm md:text-3xl font-bold tracking-wider">
                <span className="text-cyan-400">Gaia</span>
                <span className="mx-2 text-yellow-400">Says</span>
              </h1>
              <p className="text-sm opacity-80 hidden md:block">
                Space Memory Challenge
              </p>
            </div>
          </div>
        </motion.div>

        {/* User State */}
        <div className="flex  flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex justify-between gap-3">
            {/* Game Score */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeInOut", bounce: 0.25 }}
              className="pt-2 px-2 bg-white/10 backdrop-blur-sm rounded-md flex"
            >
              <Star className="text-gray-400 me-1" />
              <span className="py-1">{gameState.currentScore}</span>
            </motion.div>

            {/* Highest Score */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeInOut", bounce: 0.25 }}
              className="pt-2 px-2 bg-white/10 backdrop-blur-sm rounded-md flex"
            >
              <Trophy className="text-yellow-400/80 me-1" />
              <span className="py-1">{gameState.highestScore}</span>
            </motion.div>
          </div>
          <div className="flex justify-between gap-3">
            {/* Game Timer */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeInOut", bounce: 0.25 }}
              className="pt-2 px-2 bg-white/10 backdrop-blur-sm rounded-md flex"
            >
              <Timer className="text-blue-400/80 me-1" />
              <span className="py-1">{gameState.timeRemaining}</span>
            </motion.div>

            {/* Settings Button */}
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`pt-2 px-2 bg-white/10 backdrop-blur-sm rounded-md flex ${!gameState.isPlaying ? "cursor-not-allowed opacity-50" : "hover:cursor-pointer"
                }`}
              whileHover={!gameState.isPlaying ? {} : { scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 300,
                bounce: 0.5,
                duration: 0.6,
              }}
              disabled={!gameState.isPlaying}
              onClick={onSettingsClicked}
            >
              <Settings className="text-red-400/80" />
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}
