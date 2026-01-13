import { userController } from "@/controllers/user.controller";
import { Router } from "@koa/router";

export class UserRouter {
    public static routes(router: Router) {
        router.get('/users/me', userController.profile.bind(userController));
    }
}