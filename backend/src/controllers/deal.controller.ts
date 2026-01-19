import { dealService } from "@/services/deal.service";
import { Context } from "koa";

export class DealController {
    async getTrending(ctx: Context) {
        try {
            const deals = await dealService.getTrendingDeals();
            ctx.body = deals; 
        } catch (error) {
            console.error('Erro no DealController>', error);
            ctx.status = 500;
            ctx.body = {
                error: 'Falha interna ao carregar vitrine de ofertas.'
            };
        }
    }
}

export const dealController = new DealController();