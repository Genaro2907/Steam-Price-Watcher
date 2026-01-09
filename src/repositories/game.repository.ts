import { IGame } from "@/interfaces/game.interface";
import { GameModel } from "@/models/game.model";

export class GameRepository {
    async findByExternalId(externalID: string): Promise<IGame | null> {
        return await GameModel.findOne({ externalID }).exec();
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
    }): Promise<IGame> {
        return await GameModel.findOneAndUpdate(
            {externalID: gameData.externalID },
            {
                $set: {
                    title: gameData.title,
                    thumb: gameData.thumb,
                    steamAppID: gameData.steamAppID,
                    cheapestPrice: gameData.cheapestPrice,
                }
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        ).exec() as IGame;
    }
}

export const gameRepository = new GameRepository();