import mongoose, { Schema } from "mongoose";
import { IGame } from "../interfaces/game.interface";

const GameSchema = new Schema<IGame>(
    {
        title: String,
        externalID: { type: String, unique: true },
        thumb: String,
        cheapestPrice: Number,
    },
    {
        timestamps: true
    }
)

export const GameModel = mongoose.model<IGame>('Game', GameSchema);