"use client";
import Image from "next/image";
import { motion } from "motion/react";
import Card from "./Card";
export default function StartGame({
  highestScore,
  handleStartGame,
}: {
  highestScore: number;
  handleStartGame: () => void;
}) {
  return (
    <Card>
      {/* Card Header */}
      <Card.Header>
        <p className="text-2xl sm:text-4xl md:text-6xl font-bold text-cyan-400">
          Gaia
        </p>

        <div>
          <Image
            src="/assets/images/logo.webp"
            priority
            alt="gaia logo"
            className="w-16 h-16  sm:w-24 sm:h-24 lg:w-32 lg:h-32"
            width={128}
            height={128}
          />
        </div>

        <p className="text-2xl sm:text-4xl md:text-6xl font-bold text-yellow-400">
          Says
        </p>
      </Card.Header>
      {/* card content */}
      <Card.Content>
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
          onClick={handleStartGame}
          transition={{
            type: "spring",
            stiffness: 300,
            bounce: 0.5,
            duration: 0.3,
          }}
        >
          <span>🚀</span> Start Game
        </motion.button>
      </Card.Content>
    </Card>
  );
}
