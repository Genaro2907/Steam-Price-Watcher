import { gameRepository } from "@/repositories/game.repository";
import { cacheService } from "@/services/cache.service";
import { cheapSharkService } from "@/services/cheapShark.service";
import { steamService } from "@/services/steam.service";
import { Context } from "koa";
import z from "zod";

export class GameController {
    async search(ctx: Context) {
        const { title } = ctx.query;

        if (!title || typeof title !== 'string') {
            ctx.body = {
                error: 'O parâmetro "title" é obrigatório.' 
                
            }
            return;
        }

        const cacheKey = `search:${title.toLowerCase().trim()}`;

        try {
            console.time('Tempo Resposta');
            const cachedResult = await cacheService.get(cacheKey);

            if(cachedResult) {
                console.log(`⚡ [CACHE HIT] Retornando dados do Redis para: "${title}"`);

                ctx.body = cachedResult;

                ctx.set('x-Cache', 'HIT');
                console.timeEnd('Tempo Resposta');
                return;
            }
            console.log(`🐢 [CACHE MISS] Buscando dados externos para: "${title}"`);
            const cheapSharkresults = await cheapSharkService.searchGames(title);
            
            const enrichedresults = await Promise.all(cheapSharkresults.map( async (game) => {
                if(!game.steamAppID) {
                    return {
                        ...game,
                        priceSource: 'CheapShark (USD)',
                        currency: 'USD'
                    }
                } 

                const steamData = await steamService.getGamePriceInBRL(game.steamAppID);

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

            if(enrichedresults.length > 0) {
                await cacheService.set(cacheKey, enrichedresults, 3600);
            }

            ctx.body = enrichedresults;
            ctx.set('X-Cache', 'MISS');
            console.timeEnd('Tempo Resposta');
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
            steamAppID: z.string().nullable().optional(),
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
                steamAppID: data.steamAppID || undefined,
                thumb: data.thumb,
                cheapestPrice: data.cheapestPrice
            })

            ctx.status = 201;
            ctx.body = savedGame;
            
        } catch (error) {
            ctx.body = {
                error: 'Erro interno ao salvar monitoramento.'
            };
            ctx.status = 500;
        }
    }
}

export const gameController = new GameController();