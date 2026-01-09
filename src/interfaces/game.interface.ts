import { Document } from "mongoose";

export interface IGame extends Document {
    title: string;
    externalID: string;
    thumb: string;
    steamAppID?: string;
    cheapestPrice: number;
    createdAt: Date;
    updatedAt: Date;
}