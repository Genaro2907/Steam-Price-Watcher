import { gameController } from "@/controllers/game.controller";
import { Router } from "@koa/router";

export class GameRouter {
    public static async routes(router: Router){
        
        router.get('/games', gameController.list.bind(gameController));
        router.get('/games/search', gameController.search.bind(gameController));
        router.post('/games/monitor', gameController.monitor.bind(gameController));
    }
}