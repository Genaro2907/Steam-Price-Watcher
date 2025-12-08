import mongoose, { Schema } from "mongoose";
import { IGame } from "../interfaces/game.interface";

const GameSchema = new Schema<IGame>(
    {
        title: String,
        externalID: String,
        thumb: String,
        cheapestPrice: Number,
    }
)

export const GameModel = mongoose.model<IGame>('Game', GameSchema);