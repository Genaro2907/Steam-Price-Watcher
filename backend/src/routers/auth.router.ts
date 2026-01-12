import { Router } from '@koa/router';
import { authController } from '@/controllers/auth.controller';

export class AuthRouter {
    public static routes(router: Router) {
        router.post('/auth/register', authController.register.bind(authController));
        router.post('/auth/login', authController.login.bind(authController));
    }
}