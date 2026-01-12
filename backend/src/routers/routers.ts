import { Router } from '@koa/router';
import koa from 'koa';
import { GameRouter } from './games.router';
import { AuthRouter } from './auth.router';

export class Routes {
    static init(server: koa) {
        
        const router = new Router({ prefix: '/api/v1' });

        GameRouter.routes(router);
        AuthRouter.routes(router);

        server.use(router.routes());
        server.use(router.allowedMethods());
    }
}