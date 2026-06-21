"use client";

import Image from "next/image";
import { Planet as PlanetClass } from "@/game/Planet";
import { motion, useAnimation } from "motion/react";
import { useEffect, useState } from "react";

interface PlanetComponentProps {
  planet: PlanetClass;
  position: "left" | "right" | "top" | "bottom";
  isSequencePlaying: boolean;
}

const planetPositions = {
  left:   { translateX: "50%", translateY: "-50%", top: "50%", right: "100%" },
  right:  { translateX: "-50%", translateY: "-50%", top: "50%", left: "100%" },
  top:    { translateX: "-50%", translateY: "-50%", top: "0%", left: "50%" },
  bottom: { translateX: "-50%", translateY: "-50%", top: "100%", left: "50%" },
};

export default function PlanetComponent({
  planet,
  isSequencePlaying,
  position,
}: PlanetComponentProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [planetActive, setPlanetActive] = useState(planet.isActive);

  const controls = useAnimation();

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(hover: none)").matches);
  }, []);

  // Track changes to planet.isActive
  useEffect(() => {
    setPlanetActive(planet.isActive);
  }, [planet, planet.isActive]);

  const isInteractable =
    planet.isClickable && !planetActive && !isSequencePlaying;

  const handleClick = () => {    
    if (!isInteractable) return;
    planet.onClick();
  };

  useEffect(() => {
    if (planetActive) {
      controls.start({ scale: 1.15, padding: "0.01rem" });
    } else if (isSequencePlaying) {
      controls.start({ scale: 1, padding: 0, filter: "brightness(100%)" });
    } else if (isHovered && planet.isClickable && !isTouchDevice) {
      controls.start({ filter: "brightness(150%)" });
    } else {
      controls.start({ scale: 1, padding: 0, filter: "brightness(100%)" });
    }
  }, [
    planet.activationTick,
    planetActive,
    isSequencePlaying,
    isHovered,
    planet.isClickable,
    isTouchDevice,
    controls,
  ]);
  useEffect(() => {
    if (planet.id != 0) return;
    console.log(
      `============== Planet ${planet.id} isActive: ${planet.isActive} =================`,
    );
  }, [planet, planetActive]);
  return (
    <motion.div
      animate={controls}
      whileTap={isInteractable ? { scale: 0.8 } : undefined}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 10,
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        pointerEvents: planet.isClickable && !planetActive ? "auto" : "none",
        ...planetPositions[position],
      }}
      className={`${planetActive ? "brightness-150 duration-100 bg-[#24d358]" : ""} ${
        isInteractable ? "hover:cursor-pointer" : "cursor-not-allowed"
      } absolute w-12 h-12 sm:w-18 sm:h-18 md:w-26 md:h-26 rounded-full z-1`}
    >
      <Image
        src={planet.imagePath}
        alt={`Planet ${planet.id}`}
        width={256}
        height={256}
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
}
