import { IPriceHistory } from "@/interfaces/price-history.interface";
import { PriceHistoryModel } from "@/models/price-history.model";

export class PriceHistoryRepository {
    async create(gameId: string, price: number): Promise<IPriceHistory> {
        return await PriceHistoryModel.create({
            game: gameId,
            price: price
        });
    }

    async findByGameId(gameId: string): Promise<IPriceHistory[]> {
        return await PriceHistoryModel.find({ game: gameId })
            .sort({ checkedAt: 1})
            .exec();
    }
}

export const priceHistoryRepository = new PriceHistoryRepository();