import { redisClient } from "@/database/redis";

export class CacheService {
    async get<T>(key: string): Promise<T | null> {
        const data = await redisClient.get(key);

        if(!data) return null;

        try {
            return JSON.parse(data) as T;
        } catch {
            return null;
        }
    }

    async set(key: string, value: any, ttlInSeconds = 3600): Promise<void> {
        const stringValue = JSON.stringify(value);

        await redisClient.set(key, stringValue, 'EX', ttlInSeconds);
    }

    async del(key: string): Promise<void> {
        await redisClient.del(key);
    }
}

export const cacheService = new CacheService();