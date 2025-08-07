"use client";
import Image from "next/image";
import { motion } from "motion/react";

export default function StartGame({ highestScore }: { highestScore: number }) {
  return (
    <div className="inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm text-center bg-card/30 rounded-2xl p-8 border border-cyan-300/30 shadow-2xl">
      {/* Card Header */}
      <div className="flex items-center justify-center space-x-4">
        <p className="text-2xl sm:text-4xl md:text-6xl font-bold text-cyan-400">
          Gaia
        </p>

        <div>
          <Image
            src="/assets/images/logo.webp"
            alt="gaia logo"
            className="w-16 h-16  sm:w-24 sm:h-24 lg:w-32 lg:h-32"
            width={128}
            height={128}
          />
        </div>

        <p className="text-2xl sm:text-4xl md:text-6xl font-bold text-yellow-400">
          Says
        </p>
      </div>
      {/* card content */}
      <div className="p-4">
        <p className="text-1xl md:text-lg text-gray-300 font-light">
          Welcome to Gaia Says! <br />
          Get ready for an exciting adventure.
        </p>

        <p className="my-5 text-gray-500 text-1xl md:text-lg">
          Highest Score :{" "}
          <span className="text-yellow-300">{highestScore}</span>
        </p>
        <motion.button
          className="mt-5 px-4 py-2 bg-cyan-500 text-white rounded-md hover:cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 300,
            bounce: 0.5,
            duration: 0.3,
          }}
        >
          Start Game
        </motion.button>
      </div>
    </div>
  );
}
