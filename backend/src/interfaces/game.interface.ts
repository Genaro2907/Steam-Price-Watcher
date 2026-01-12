import { Document, Types } from "mongoose";
import { IUser } from "./user.interface";

export interface IGame extends Document {
    title: string;
    externalID: string;
    thumb: string;
    steamAppID?: string;
    cheapestPrice: number;
    user: Types.ObjectId | IUser;
    createdAt: Date;
    updatedAt: Date;
}