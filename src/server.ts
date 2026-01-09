import { Router } from '@koa/router';
import Koa from 'koa';
import koaBody from 'koa-body';
import { connectDB } from './database/mongo';
import { Routes } from './routers/routers';

const app = new Koa();
const router = new Router();

app.use(koaBody({
    multipart: true,
    jsonLimit: '10mb',
    formLimit: '10mb'
}));
 
const rootRouter = new Router();
rootRouter.get('/', (ctx) => {
    ctx.body = {
        project: "Steam Price Watcher API",
        version: '1.0.0',
        status: 'running',
        docs: '/api/v1/games/search'
    };
});
app.use(rootRouter.routes());

Routes.init(app);

const PORT = process.env.PORT || 3001;
const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
    console.log(`🚀 Server rodando na porta ${PORT}`);
    })
}

startServer();