import { Document, Types } from "mongoose";
import { IGame } from "./game.interface";

export interface IPriceHistory extends Document {
    game: IGame | Types.ObjectId;
    price: number;
    checkedAt: Date;
}