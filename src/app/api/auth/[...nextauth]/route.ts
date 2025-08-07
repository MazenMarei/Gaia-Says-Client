import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import connectToDatabase from "@/lib/mongodb";
import { Player } from "@/models/Player";

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: import("next-auth").User;
      account: import("next-auth").Account | null;
      profile?: import("next-auth").Profile;
    }) {
      if (account?.provider === "discord") {
        try {
          await connectToDatabase();

          // Check if user exists
          let player = await Player.findOne({ discordId: user.id });

          if (!player) {
            // Create new player
            player = new Player({
              discordId: user.id,
              username: user.name,
              avatar: user.image,
            });
            await player.save();
          } else {
            // Update existing player info
            player.username = user.name;
            player.avatar = user.image;
            player.lastPlayed = new Date();
            await player.save();
          }

          return true;
        } catch (error) {
          console.error("Error during sign in:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }: { session: import("next-auth").Session; token: import("next-auth/jwt").JWT }) {
      type CustomSessionUser = typeof session.user & {
        playerId?: string;
        highestScore?: number;
        gamesPlayed?: number;
      };
      if (session.user) {
        await connectToDatabase();
        const player = await Player.findOne({ discordId: token.sub });
        if (player) {
          (session.user as CustomSessionUser).playerId = player._id.toString();
          (session.user as CustomSessionUser).highestScore = player.highestScore;
          (session.user as CustomSessionUser).gamesPlayed = player.gamesPlayed;
        }
      }
      return session;
    },
    async jwt({
      token,
      user,
      account,
      profile,
      isNewUser,
    }: {
      token: import("next-auth/jwt").JWT;
      user?: import("next-auth").User;
      account?: import("next-auth").Account | null;
      profile?: import("next-auth").Profile;
      isNewUser?: boolean;
    }) {
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
