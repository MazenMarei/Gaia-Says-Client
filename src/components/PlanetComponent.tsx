"use client";

import Image from "next/image";
import { Planet as PlanetClass } from "@/game/Planet";

interface PlanetComponentProps {
  planet: PlanetClass;
  centerX: number;
  centerY: number;
}

export default function PlanetComponent({
  planet,
  centerX,
  centerY,
}: PlanetComponentProps) {
  const handleClick = () => {
    planet.onClick();
  };

  const handleHover = () => {
    planet.onHover?.();
  };

  return (
    <div
      className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
        planet.isClickable ? "hover:scale-110" : "cursor-not-allowed"
      } ${planet.isActive ? "scale-125 brightness-150" : "scale-100"}`}
      style={{
        left: centerX + planet.position.x,
        top: centerY + planet.position.y,
        filter: planet.isActive
          ? "drop-shadow(0 0 20px #00ffff)"
          : "drop-shadow(0 0 0px #fff)",
      }}
      onClick={handleClick}
      onMouseEnter={handleHover}
    >
      <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
        <Image
          src={planet.imagePath}
          alt={`Planet ${planet.id}`}
          fill
          className="object-contain"
          draggable={false}
          priority
        />
      </div>

      {/* Orbital ring effect */}
      <div
        className="absolute inset-0 rounded-full border border-blue-300/30 animate-spin"
        style={{
          width: "120%",
          height: "120%",
          left: "-10%",
          top: "-10%",
          animationDuration: "20s",
        }}
      />
    </div>
  );
}
