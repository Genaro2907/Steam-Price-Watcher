import { Router } from '@koa/router';
import koa from 'koa';
import { GameRouter } from './games.router';
import { AuthRouter } from './auth.router';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class Routes {
    static init(server: koa) {
        const authRouter = new Router();
        authRouter.prefix('/api/auth');

        AuthRouter.routes(authRouter);
        server.use(authRouter.routes()).use(authRouter.allowedMethods());
        
        const router = new Router({ prefix: '/api/v1' });
        router.use(AuthMiddleware.verifyToken);
        
        GameRouter.routes(router);

        server.use(router.routes());
        server.use(router.allowedMethods());
    }
}