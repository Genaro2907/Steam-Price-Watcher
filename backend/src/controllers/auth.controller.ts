import { UserModel } from "@/models/user.model";
import { Context } from "koa";
import z from "zod";
import jwt from 'jsonwebtoken';

export class AuthController {
    private registerSchema = z.object({
        name: z.string().min(3, "Nome deve ter no minimo 3 caracteres"),
        email: z.email(),
        password: z.string().min(6, { message: "Senha deve ter no minimo 6 caracteres"}),
        phoneNumber: z.string().optional()
    });

    private loginSchema = z.object({
        email: z.email(),
        password: z.string()
    });

    async register(ctx: Context, next: Function) {
        const validation = this.registerSchema.safeParse(ctx.request.body);

        if(!validation.success){
            ctx.status = 400;
            ctx.body = {
                error: 'Dados inválidos',
                details: validation.error.format()
            };
            return;
        }

        const { name, email, password, phoneNumber } = validation.data;

        try {
            const userExists = await UserModel.exists({ email });
            if(userExists) {
                ctx.status = 409;
                ctx.body = {
                    error: 'Este e-mail já está em uso'
                }
                return;
            }

            const newUser = await UserModel.create({
                name,
                email,
                passwordHash: password,
                phoneNumber
            });

            const token = this.generateToken(newUser._id.toString());

            ctx.body = {
                message: "Usuário criado com sucesso",
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email
                },
                token
            };
            
        } catch (error) {
            console.error('Erro no registro:', error);
            ctx.status = 500;
            ctx.body = {
                error: 'Erro interno ao criar usuário'
            };
        }
    }

    async login(ctx: Context, next: Function) {
        const validation = this.loginSchema.safeParse(ctx.request.body);

        if(!validation.success) {
            ctx.status = 400;
            ctx.body = {
                error: "Formato de dados inválido",
                details: validation.error.format()
            };
            return;
        }

        const { email, password } = validation.data;

        try {
            const user = await UserModel.findOne({ email}).select('+passwordHash');

            if(!user) {
                ctx.status = 401;
                ctx.body = {
                    error: "Credenciais inválidas"
                };
                return;
            }
            const isMatch = await user.comparePassword(password);

            if(!isMatch) {
                ctx.status = 401;
                ctx.body = {
                    error: "Credenciais inválidas"
                };
                return;
            }

            const token = this.generateToken(user._id.toString());

            ctx.body = {
                message: "Login realizado com sucesso",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                },
                token
            };

        } catch (error) {
            console.error('Erro no login:', error);
            ctx.status = 500;
            ctx.body = {
                error: 'Erro interno no login'
            };
        }
    }

    private generateToken(userId: string): string {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error("FATAL: JWT_SECRET não definido no .env");
        const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
        
        return jwt.sign({ id: userId }, secret, { 
            expiresIn: expiresIn as any
        });
    }
}

export const authController = new AuthController();