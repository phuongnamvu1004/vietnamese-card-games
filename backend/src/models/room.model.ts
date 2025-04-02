// models/user.model.ts
import mongoose, { Document, Schema, Types } from "mongoose";

export interface IRoom extends Document {
  _id: Types.ObjectId;
  roomId: string;
  hostUserId: string,
  gameType: "sam" | "phom",
  maxPlayers: number,
  players: string[],
  buyIn: number,
  valuePerPoint: number,
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IRoom>(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    hostUserId: {
      type: String,
      required: true,
    },
    gameType: {
      type: String,
      required: true,
    },
    maxPlayers: {
      type: Number,
      required: true,
      default: 4,
    },
    players: {
      type: [String],
      required: true,
      min: 2,
    },
    buyIn: {
      type: Number,
      required: true,
    },
    valuePerPoint: {
      type: Number,
      required: true 
    }
  },
  { timestamps: true }
);

const Room = mongoose.model<IRoom>("Room", userSchema);

export default Room;
