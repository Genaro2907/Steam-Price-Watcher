import { Context, Next } from "koa";
import jwt from 'jsonwebtoken';
import { UserModel } from "@/models/user.model";

interface TokenPayload {
    id: string;
    iat: number;
    exp: number;
}

export class AuthMiddleware {
    public static async verifyToken (ctx: Context, next: Next) {
        const authHeader = ctx.header.authorization;

        if(!authHeader) {
            ctx.status = 401;
            ctx.body = {
                error: 'Acessso negado. Token de autenticação ausente.'
            };
            return;
        }

        const token = authHeader.replace('Bearer ', '');
        const secret = process.env.JWT_SECRET;

        if(!secret) {
            console.error("FATAL: JWT_SECRET não definido.");
            ctx.status = 500;
            return;
        }

        try {
            const decoded = jwt.verify(token, secret) as TokenPayload;

            const user = await UserModel.findById(decoded.id)
                .select('-passwordHash')
                .lean();

            if (!user) {
                ctx.status = 401;
                ctx.body = { error: 'Usuário associado ao token não encontrado.' };
                return;
            }
            ctx.state.user = user;
            await next();
            
        } catch (error) {
            if(error instanceof jwt.TokenExpiredError) {
                ctx.status = 401;
                ctx.body = {
                    error: 'Sessão expirada. Faça login novamente.'
                };
            } else {
                ctx.status = 401;
                ctx.body = {
                    error: "Token inválido."
                };
            }

        }
    }
}