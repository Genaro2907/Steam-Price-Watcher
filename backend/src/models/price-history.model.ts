import { IPriceHistory } from "@/interfaces/price-history.interface";
import { model, Schema, Types } from "mongoose";

const PriceHistorySchema = new Schema<IPriceHistory>(
    {
        game: {
            type: Types.ObjectId,
            ref: 'Game'
        },
        price: Number,
        checkedAt: Date
    },
    {
        timestamps: { createdAt: true, updatedAt: false }
    }
);

PriceHistorySchema.index({ game: 1, checkedAt: -1});

export const PriceHistoryModel = model<IPriceHistory>('PriceHistory', PriceHistorySchema);