import localFont from "next/font/local";

export const inter = localFont({
  src: [
    {
      path: "./fonts/StagewanderRegular-4ne3D.otf",
      style: "normal",
    },
    {
      path: "./fonts/StageWanderRegular-0vGDX.ttf",
      style: "normal",
    },
  ],
  variable: "--font-inter", // optional for CSS variable
  display: "swap", // optional: 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
});
