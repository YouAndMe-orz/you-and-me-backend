import { Inject, Injectable } from '@nestjs/common';
import { REDIS_CLIENT } from './cache.provider';
import { RedisClientType } from 'redis';

@Injectable()
export class CacheService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: RedisClientType) {}

  async set(key: string, value: string, ttlSeconds = 180): Promise<void> {
    await this.redis.set(key, value, { EX: ttlSeconds });
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async del(key: string): Promise<number> {
    return await this.redis.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }
}
