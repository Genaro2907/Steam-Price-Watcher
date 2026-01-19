import { dealController } from "@/controllers/deal.controller";
import { Router } from "@koa/router";

export class DealRouter {
    public static routes(router: Router) {
        router.get('/deals/trending', dealController.getTrending.bind(dealController));
    }
}