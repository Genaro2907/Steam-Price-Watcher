import { bodyParser } from '@koa/bodyparser';
import { Router } from '@koa/router';
import Koa from 'koa';

const app = new Koa();
const router = new Router();

app.use(bodyParser());

router.get('/', (ctx) => {
    ctx.body = {
        project: "Steam Price watcher API",
        version: '1.0.0',
        status: 'running'
    };
});

app.use(router.routes()).use(router.allowedMethods());

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`🚀 Server rodando na porta ${PORT}`);
})