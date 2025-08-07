"use client";

import Game from "@/components/Game";

export default function Home() {
  const handleSignIn = () => {
    console.log("Sign in with Discord");
  };

  const handleSignOut = () => {
    console.log("Sign out");
  };

  return (
    <main className="w-full h-screen">
      <Game user={null} onSignIn={handleSignIn} onSignOut={handleSignOut} />
    </main>
  );
}
