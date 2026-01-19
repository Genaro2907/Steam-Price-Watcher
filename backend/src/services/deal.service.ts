import { ICheapSharkDeal, ITrendingDeal } from "@/interfaces/deal.interface";
import { cacheService } from "./cache.service";
import axios from "axios";
import { steamService } from "./steam.service";

export class DealService {
    private readonly CACHE_KEY = 'deals:trending';
    private readonly TTL = 3600;
    private readonly API_URL = 'https://www.cheapshark.com/api/1.0/deals';

    public async getTrendingDeals(): Promise<ITrendingDeal[]> {
        const cachedData = await cacheService.get<ITrendingDeal[]>(this.CACHE_KEY);
        
        if (cachedData) {
            return cachedData;
        }

        console.log('⚠️ [DealService] Cache vazio. Forçando atualização síncrona...');
        return await this.refreshCache();
    }

    public async refreshCache(): Promise<ITrendingDeal[]> {
        console.log(' [DealService] Iniciando atualização de rending Deals');

        try {
            const response = await axios.get<ICheapSharkDeal[]>(this.API_URL, {
                params: { 
                    storeID: '1', 
                    onSale: '1', 
                    sortBy: 'Savings', 
                    pageSize: '20' 
                },
                timeout: 10000,
                headers: { 
                    'User-Agent': 'SteamPriceWatcher/1.0', 
                    'Accept-Encoding': 'gzip,deflate' 
                }
            });

            const enrichedDeals = await Promise.all(response.data.map(async (deal) => {
                await new Promise(r => setTimeout(r, Math.random() * 500));

                const steamData = await steamService.getGamePriceInBRL(deal.steamAppID);

                if (steamData && steamData.price_overview) {
                    return {
                        dealID: deal.dealID,
                        title: deal.title,
                        thumb: deal.thumb,
                        steamAppID: deal.steamAppID,
                        steamUrl: `https://store.steampowered.com/app/${deal.steamAppID}`,
                        salePrice: steamData.price_overview.final / 100,
                        normalPrice: steamData.price_overview.initial / 100,
                        savings: steamData.price_overview.discount_percent,
                        currency: 'BRL' as const
                    };
                }

                return {
                    dealID: deal.dealID,
                    title: deal.title,
                    thumb: deal.thumb,
                    steamAppID: deal.steamAppID,
                    steamUrl: `https://store.steampowered.com/app/${deal.steamAppID}`,
                    salePrice: Number(deal.salePrice),
                    normalPrice: Number(deal.normalPrice),
                    savings: Math.round(Number(deal.savings)),
                    currency: 'USD' as const
                };
            }));


            if (enrichedDeals.length > 0) {
                await cacheService.set(this.CACHE_KEY, enrichedDeals, this.TTL);
                console.log(`✅ [DealService] Cache atualizado com ${enrichedDeals.length} ofertas.`);
            }

            return enrichedDeals;

        } catch (error) {
            console.error('❌ [DealService] Falha na atualização em background:', error);
            return []; 
        }
    }
}

export const dealService = new DealService();