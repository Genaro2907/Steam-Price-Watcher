import mongoose from "mongoose";


export const connectDB = async () => {
    try{
        console.log('⏳ Conectando ao MongoDB...');

        const url = process.env.MONGO_URI;

        if(!url){
            throw new Error('MONGO_URI não definida no .env');
        }

        await mongoose.connect(url, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log('🔥 MongoDB Conectado com sucesso!');

        mongoose.connection.on('error', (err) => {
            console.error('❌ Erro na conexão Mongo', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB desconectado');
        })

    }catch(err) {
        console.error('❌ Falha fatal ao conectar no banco:', err);
        process.exit(1)
    }
};