import { Router } from '@koa/router';
import koa from 'koa';

export class Routes {
    static init(server: koa) {
        
        const router = new Router();
        server.use(router.routes()).use(router.allowedMethods());
        router.prefix('/api/v1');

    }
}