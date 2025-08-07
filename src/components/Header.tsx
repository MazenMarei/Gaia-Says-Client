"use client";

import Image from "next/image";

interface HeaderProps {
  user?: {
    name?: string;
    image?: string;
    highestScore?: number;
  } | null;
  onSignIn: () => void;
  onSignOut: () => void;
}

export default function Header({ user, onSignIn, onSignOut }: HeaderProps) {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 p-4">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center space-x-3 opacity-0 animate-pulse"
          style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
        >
          <div
            className="relative w-12 h-12 animate-spin"
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
          <div className="text-white">
            <h1 className="text-3xl font-bold tracking-wider">
              <span className="text-cyan-400">Gaia</span>
              <span className="mx-2 text-yellow-400">Says</span>
            </h1>
            <p className="text-sm opacity-80">Space Memory Challenge</p>
          </div>
        </div>

        {/* User Section */}
        <div
          className="flex items-center space-x-4 opacity-0 animate-pulse"
          style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}
        >
          {user ? (
            <div className="flex items-center space-x-3 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={user.image || "/default-avatar.png"}
                  alt={user.name || "User"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-white">
                <div className="font-semibold">{user.name}</div>
                <div className="text-xs opacity-80">
                  Best: {user.highestScore?.toLocaleString() || 0}
                </div>
              </div>
              <button
                onClick={onSignOut}
                className="bg-red-600/80 hover:bg-red-700/80 text-white px-3 py-1 rounded text-sm transition-all hover:scale-105 active:scale-95"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center space-x-2 transition-all hover:scale-105 active:scale-95"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z" />
              </svg>
              <span>Sign in with Discord</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
