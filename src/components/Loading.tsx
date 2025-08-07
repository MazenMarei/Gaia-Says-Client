"use client";
import Image from "next/image";
import { motion } from "motion/react";

export default function Loading() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center space-y-4 z-10"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.6,
        scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
      }}
    >
      {/* Logo and text container */}
      <div className="flex items-center justify-center space-x-4">
        <motion.p
          className="text-4xl md:text-6xl font-bold text-cyan-400"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Gaia
        </motion.p>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 1,
            scale: { delay: 0.3, duration: 0.5 },
          }}
        >
          <Image
            src="/assets/images/logo.webp"
            alt="gaia logo"
            className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32"
            width={128}
            height={128}
          />
        </motion.div>

        <motion.p
          className="text-4xl md:text-6xl font-bold text-yellow-400"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Says
        </motion.p>
      </div>

      {/* Subtitle */}
      <motion.p
        className="text-lg md:text-xl text-gray-300 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        Space Memory Challenge
      </motion.p>

      {/* Loading spinner */}
      <motion.div
        className="flex space-x-2 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.3 }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-blue-400 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
