import { motion } from "motion/react";
import Image from "next/image";

export default function SolarSys() {
  return (
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
            className="absolute z-0 w-1 h-8 bg-gradient-to-t from-purple-400/60 to-transparent origin-[0%_3.3rem]  md:origin-[0%_4.3rem] lg:origin-[0%_5.3rem] bottom-[90%] left-[50%] transition-all duration-300"
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
      />

      {/* orbit  */}
      <div
        className="absolute w-35 h-35 md:w-80 md:h-80 sm:w-70 sm:h-70 rounded-full border-2 border-dashed border-gray-300 transition-all duration-300 animate-spin"
        style={{ animationDuration: "20s" }}
      >
        {/* planet  */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 300,
            bounce: 0.5,
            duration: 0.6,
          }}
          className="absolute w-12 h-12 md:w-26 md:h-26 sm:w-18 sm:h-18 rounded-full bg-gray-300 top-[50%] left-[100%] translate-x-[-50%] translate-y-[-50%] transition-all duration-300"
        ></motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 300,
            bounce: 0.5,
            duration: 0.6,
          }}
          className="absolute w-12 h-12 md:w-26 md:h-26 sm:w-18 sm:h-18 rounded-full bg-gray-300 top-[50%] right-[100%] translate-x-[50%] translate-y-[-50%] transition-all duration-300"
        ></motion.div>
      </div>

      {/* orbit  */}
      <div
        className="absolute w-60 h-60 md:w-140 md:h-140 sm:w-105 sm:h-105 rounded-full border-2 border-dashed border-gray-300 transition-all duration-300 animate-spin"
        style={{ animationDuration: "40s" }}
      >
        {/* planet  */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 300,
            bounce: 0.5,
            duration: 0.6,
          }}
          className="absolute w-12 h-12 md:w-26 md:h-26 sm:w-18 sm:h-18 rounded-full bg-gray-300 top-[100%] left-[50%] translate-x-[-50%] translate-y-[-50%] transition-all duration-300"
        ></motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 300,
            bounce: 0.5,
            duration: 0.6,
          }}
          className="absolute w-12 h-12 md:w-26 md:h-26 sm:w-18 sm:h-18 rounded-full bg-gray-300 top-[0%] right-[50%] translate-x-[50%] translate-y-[-50%] transition-all duration-300"
        ></motion.div>
      </div>

      {/* orbit  */}
      <div
        className="absolute w-85 h-85 md:w-200 md:h-200 sm:w-140 sm:h-140 rounded-full border-2 border-dashed border-gray-300 transition-all duration-300 animate-spin"
        style={{ animationDuration: "60s" }}
      >
        {/* planet  */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 300,
            bounce: 0.5,
            duration: 0.6,
          }}
          className="absolute w-12 h-12 md:w-26 md:h-26 sm:w-18 sm:h-18 rounded-full bg-gray-300 top-[50%] left-[100%] translate-x-[-50%] translate-y-[-50%] transition-all duration-300"
        ></motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 300,
            bounce: 0.5,
            duration: 0.6,
          }}
          className="absolute w-12 h-12 md:w-26 md:h-26 sm:w-18 sm:h-18 rounded-full bg-gray-300 top-[50%] right-[100%] translate-x-[50%] translate-y-[-50%] transition-all duration-300"
        ></motion.div>
      </div>
    </div>
  );
}
