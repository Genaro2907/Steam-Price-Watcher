import { gameRepository } from "@/repositories/game.repository";
import { priceHistoryRepository } from "@/repositories/price-history.repository";
import { steamService } from "@/services/steam.service";
import { CronJob } from "cron";
import dayjs from "dayjs";

export class UpdatePricesJob {
    private static readonly CRON_TIME = '*/99 * * * *';

    public static init() {
        console.log('🕰️ [Job] Agendador de preços inicializado.');
        const job = new CronJob(this.CRON_TIME, async () => {
            await this.handle();
        });
        
        job.start();
    }

    private static async handle() {
        const now = dayjs().format('HH:mm:ss');
        console.log(`🤖 [Job ${now}] Iniciando verificação de preços...`);

        try {
            const games = await gameRepository.findAll();

            if(games.length === 0) {
                console.log(`🤖 [Job] Nenhum jogo para monitorar.`);
                return;
            }

            console.log(`🤖 [Job] Encontrados ${games.length} jogos para verificar.`);
            
            for(const game of games) {
                if(!game.steamAppID){
                    continue;
                }
                
                await new Promise(r => setTimeout(r, 1000));

                const priceData = await steamService.getGamePriceInBRL(game.steamAppID);

                if(priceData && priceData.price_overview) {
                    const currentPrice = priceData.price_overview.final / 100;

                    const ownerId = game.user.toString();

                    if(!ownerId) {
                        continue;
                    }
                    if(currentPrice !== game.cheapestPrice) {
                        console.log(`📉 [ATUALIZAÇÃO] ${game.title}: R$ ${game.cheapestPrice} -> R$ ${currentPrice}`);

                        await gameRepository.saveOrUpdate({
                            title: game.title,
                            externalID: game.externalID,
                            steamAppID: game.steamAppID,
                            thumb: game.thumb,
                            cheapestPrice: currentPrice,
                            userId: ownerId
                        });

                         await priceHistoryRepository.create(game._id.toString(), currentPrice);
                         console.log(`📜 [HISTÓRICO] Preço de R$ ${currentPrice} arquivado.`);

                         
                    } else {
                        // console.log(`✅ [SEM MUDANÇA] ${game.title} continua R$ ${currentPrice}`);

                        await gameRepository.saveOrUpdate({
                            title: game.title,
                            externalID: game.externalID,
                            steamAppID: game.steamAppID,
                            thumb: game.thumb,
                            cheapestPrice: currentPrice,
                            userId: ownerId
                        });
                    }
                }
            }
            console.log(`🤖 [Job] Ciclo de verificação finalizado.`);

        } catch (error) {
            console.error('🔥 [Job Error] Falha ao rodar atualização:', error);
        }
    }
}