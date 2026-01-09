import axios, { AxiosInstance } from "axios";
import z from "zod";

const SteamPriceSchema = z.object({
    price_overview: z.object({
        currency: z.string(),
        initial: z.number(),
        final: z.number(),
        discount_percent: z.number(),
        final_formatted: z.string()
    }).optional()
});


export class SteamService {
    private readonly BASE_URL  = 'https://store.steampowered.com/api/appdetails';

    async getGamePriceInBRL(steamAppId: string) {
        try {
            const response = await axios.get(this.BASE_URL, {
                params: {
                    appids: steamAppId,
                    cc: 'br',
                    filters: 'price_overview'
                }
            })

            const gameData = response.data[steamAppId];

            if(!gameData || !gameData.success) {
                console.warn(`[SteamService] Falha ao obter dados para ID ${steamAppId}`);
                return null;
            }
            const parsedData = SteamPriceSchema.safeParse(gameData.data);

            if(!parsedData.success){
                return null;
            }

            return parsedData.data;
        } catch (error) {
            console.error(`[SteamService] Erro na requisição:`, error);
            return null;
        }
    }
}

export const steamService = new SteamService();