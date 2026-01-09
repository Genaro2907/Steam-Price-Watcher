import Redis from "ioredis";

const redisConfig = {
    host: 'localhost',
    port: 6380,
    password: undefined,
    db: 0,
};

export const redisClient = new Redis(redisConfig);

redisClient.on('connect', () => {
    console.log('⚡ Redis conectado com sucesso na porta 6380!')
})

redisClient.on('error', (err) => {
    console.error('🔥 Erro na conexão com Redis:', err);
})