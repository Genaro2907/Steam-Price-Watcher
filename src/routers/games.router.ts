import { gameController } from "@/controllers/game.controller";
import { Router } from "@koa/router";

export class GameRouter {
    public static async routes(router: Router){
        router.get('/games/search', gameController.serach.bind(gameController));
        router.post('/games/monitor', gameController.serach.bind(gameController));

    }
}