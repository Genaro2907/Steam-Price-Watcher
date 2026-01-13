import { IGame } from "@/interfaces/game.interface";
import { GameModel } from "@/models/game.model";

export class GameRepository {
    async findByExternalId(externalID: string): Promise<IGame | null> {
        return await GameModel.findOne({ externalID }).exec();
    }

    async findAllByUser(userId: string): Promise<IGame[]> {
        return await GameModel.find({ user: userId })
            .sort({ createdAt: -1 })
            .exec();
    }

    async findAll(): Promise<IGame[]> {
        return await GameModel.find({}).exec();
    }

    async saveOrUpdate(gameData: {
        title: string;
        externalID: string;
        steamAppID?: string;
        thumb: string;
        cheapestPrice: number;
        userId: string;
    }): Promise<IGame> {
        return await GameModel.findOneAndUpdate(
            {
                externalID: gameData.externalID,
                user: gameData.userId
             },
            {
                $set: {
                    title: gameData.title,
                    thumb: gameData.thumb,
                    steamAppID: gameData.steamAppID,
                    cheapestPrice: gameData.cheapestPrice,
                    userId: gameData.userId
                }
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        ).exec() as IGame;
    }

    async deleteByUser(externalID: string, userId: string): Promise<boolean> {
        const result = await GameModel.deleteOne({
            externalID,
            user: userId
        }).exec();

        return result.deletedCount === 1;
    }
}

export const gameRepository = new GameRepository();