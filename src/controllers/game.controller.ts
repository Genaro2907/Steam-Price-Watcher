import { gameRepository } from "@/repositories/game.repository";
import { cheapSharkService } from "@/services/cheapShark.service";
import { steamService } from "@/services/steam.service";
import { Context } from "koa";
import z from "zod";

export class GameController {
    async serach(ctx: Context) {
        const { title } = ctx.query;

        if (!title || typeof title !== 'string') {
            ctx.body = {
                error: 'O parâmetro "title" é obrigatório.' 
                
            }
            return;
        }

        try {
            const cheapSharkresults = await cheapSharkService.searchGames(title);
            
            const enrichedresults = await Promise.all(cheapSharkresults.map( async (game) => {
                if(!game.steamAppId) {
                    return {
                        ...game,
                        priceSource: 'CheapShark (USD)',
                        currency: 'USD'
                    }
                } 

                const steamData = await steamService.getGamePriceInBRL(game.steamAppId);

                if(steamData && steamData.price_overview) {
                    return {
                        ...game,
                        cheapest: steamData.price_overview.final / 100,
                        thumb: game.thumb,
                        currency: 'BRL',
                        priceSource: 'Steam Store(BRL)',
                        formattedPrice: steamData.price_overview.final_formatted
                    }
                }

                return { ...game, currency: 'USD', priceSource: 'CheapShark (USD)' };
            }));

            ctx.body = enrichedresults;
        } catch (error) {
            console.error('Erro no controller de busca: ', error);
            ctx.body = {
                error: 'Falha interna ao buscar jogos.'
            };
            ctx.status = 500;
        }
    }

    async monitor(ctx: Context) {
        const MonitorGameSchema = z.object({
            title: z.string()
                .min(1, "O título é obrigatório"),
            externalID: z.string()
                .min(1, "O ID externo é obrigatório"),
            thumb: z.string().optional().default(''),
            cheapestPrice: z.union([z.string(), z.number()])
                .transform((val) => Number(val)),
        })

        const body = ctx.request.body;
        const validation = MonitorGameSchema.safeParse(body);

        if(!validation.success) {
            ctx.status = 400;
            ctx.body = {
                error: 'Dados inválidos',
                details: validation.error.format()
            };
            return;
        }

        const data = validation.data;

        try {

            const savedGame = await gameRepository.saveOrUpdate({
                title: data.title,
                externalID: data.externalID,
                thumb: data.thumb,
                cheapestPrice: data.cheapestPrice
            })
            
        } catch (error) {
            ctx.body = {
                error: 'Erro interno ao salvar monitoramento.'
            };
            ctx.status = 500;
        }
    }
}

export const gameController = new GameController();