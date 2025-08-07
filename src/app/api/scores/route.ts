import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Player, GameSession } from "@/models/Player";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { playerId, score, level, duration } = await request.json();

    if (!playerId || typeof score !== "number") {
      return NextResponse.json(
        { error: "Player ID and score are required" },
        { status: 400 }
      );
    }

    // Create game session
    const gameSession = new GameSession({
      playerId,
      score,
      level: level || 1,
      duration: duration || 0,
    });
    await gameSession.save();

    // Update player stats
    const player = await Player.findById(playerId);
    if (player) {
      player.gamesPlayed += 1;
      player.lastPlayed = new Date();
      if (score > player.highestScore) {
        player.highestScore = score;
      }
      await player.save();
    }

    return NextResponse.json({
      success: true,
      gameSession: gameSession._id,
      newHighScore: player?.highestScore || 0,
    });
  } catch (error) {
    console.error("Error saving score:", error);
    return NextResponse.json(
      { error: "Failed to save score" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get("playerId");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (playerId) {
      // Get specific player's scores
      const sessions = await GameSession.find({ playerId })
        .sort({ completedAt: -1 })
        .limit(limit);

      return NextResponse.json({ sessions });
    } else {
      // Get leaderboard
      const topPlayers = await Player.find()
        .sort({ highestScore: -1 })
        .limit(limit)
        .select("username avatar highestScore gamesPlayed");

      return NextResponse.json({ leaderboard: topPlayers });
    }
  } catch (error) {
    console.error("Error fetching scores:", error);
    return NextResponse.json(
      { error: "Failed to fetch scores" },
      { status: 500 }
    );
  }
}
