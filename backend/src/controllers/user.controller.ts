import { userRepository } from "@/repositories/user.repository";
import { Context } from "koa";

export class UserController {
    async profile(ctx: Context, next: Function) {
        const userState = ctx.state.user;

        if (!userState || !userState._id) {
            ctx.status = 401;
            ctx.body = { 
                error: 'Token inválido ou expirado.' 
            };
            return;
        }
        try {
            const user = await userRepository.findById(userState._id);

            if(!user) {
                ctx.status = 404;
                ctx.body = {
                    error: 'Usuário não encontrado.'
                };
                return;
            }

                ctx.body = {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    createdAt: user.createdAt 
                }
            
        } catch (error) {
            console.error('Erro ao buscar perfil: ', error);
            ctx.status = 500;
            ctx.body = {
                error: "Erro interno ao buscar perfil."
            }
        }
    }
}

export const userController = new UserController();