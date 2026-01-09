import { Router } from '@koa/router';
import koa from 'koa';
import { GameRouter } from './games.router';

export class Routes {
    static init(server: koa) {
        
        const router = new Router({ prefix: '/api/v1' });

        GameRouter.routes(router);

        server.use(router.routes());
        server.use(router.allowedMethods());
    }
}