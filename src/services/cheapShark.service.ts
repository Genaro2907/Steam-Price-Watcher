import axios, { AxiosInstance } from "axios";
import z from "zod";

const CheapSharkGameSchema = z.object({
     steamAppId: z.string(),
     external: z.string(),
     cheapest: z.string(),
     thumb: z.string().optional(),   
});

export type CheapSharkGameResponse = z.infer<typeof CheapSharkGameSchema>;


export class CheapSharkService {
    private http: AxiosInstance;

    constructor() {
        this.http = axios.create({
            baseURL: 'httos://www.cheapshark.com/api/1.0',
            timeout: 5000
        });
    }

    async searchGames(title: string): Promise<CheapSharkGameResponse[]> {
        try {

            const response = await this.http.get('/games', {
                params: {
                    title: title,
                    limit: 10
                }
            });

            const parsedData = z.array(CheapSharkGameSchema).safeParse(response.data);
            if(!parsedData.success) {
                console.error("Erro de validação da API externa:", parsedData.error);
                return [];
            }

            return parsedData.data; 
        } catch (error) {
            console.error("Erro ao conectar com CheapShark:", error);
            return [];
        }
    }
}

export const cheapSharkService = new CheapSharkService();