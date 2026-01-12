import mongoose, { Schema, Types } from "mongoose";
import { IGame } from "../interfaces/game.interface";

const GameSchema = new Schema<IGame>(
    {
        title: String,
        externalID: String,
        thumb: String,
        steamAppID: String,
        cheapestPrice: Number,
        user: {
            type: Types.ObjectId,
            ref: 'User',
            index: true
        }
    },
    {
        timestamps: true
    }
);

GameSchema.index({ user: 1, externalID: 1}, { unique: true});

export const GameModel = mongoose.model<IGame>('Game', GameSchema);