import { Router } from '@koa/router';
import Koa from 'koa';
import koaBody from 'koa-body';
import { connectDB } from './database/mongo';

const app = new Koa();
const router = new Router();

app.use(koaBody({
    multipart: true,
    jsonLimit: '10mb',
    formLimit: '10mb'
}));

router.get('/', (ctx) => {
    ctx.body = {
        project: "Steam Price watcher API",
        version: '1.0.0',
        status: 'running'
    };
}); 

app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3001;
const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
    console.log(`🚀 Server rodando na porta ${PORT}`);
    })
}

startServer();