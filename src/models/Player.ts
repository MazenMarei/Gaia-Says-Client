import mongoose from "mongoose";

const PlayerSchema = new mongoose.Schema(
  {
    discordId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    highestScore: {
      type: Number,
      default: 0,
    },
    gamesPlayed: {
      type: Number,
      default: 0,
    },
    lastPlayed: {
      type: Date,
      default: Date.now,
    },
    totalTimePlayed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const GameSessionSchema = new mongoose.Schema(
  {
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Player =
  mongoose.models.Player || mongoose.model("Player", PlayerSchema);
export const GameSession =
  mongoose.models.GameSession ||
  mongoose.model("GameSession", GameSessionSchema);
