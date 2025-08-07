// Simple types for development without actual packages
export interface User {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  playerId?: string;
  highestScore?: number;
  gamesPlayed?: number;
}

export interface Session {
  user?: User;
  expires?: string;
}

// Simple motion component that doesn't require framer-motion
export const motion = {
  div: "div" as React.ElementType,
  button: "button" as React.ElementType,
};

// Simple session hooks
export function useSession(): { data: Session | null } {
  return { data: null };
}

export function signIn(provider?: string): void {
  console.log("Sign in with", provider);
}

export function signOut(): void {
  console.log("Sign out");
}

// Simple session provider
export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
