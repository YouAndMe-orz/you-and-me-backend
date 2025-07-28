// src/redis/redis.provider.ts
import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';
import { createClient } from 'redis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const CacheProvider: Provider = {
  provide: REDIS_CLIENT,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const client = createClient({
      socket: {
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        reconnectStrategy: () => 1000,
      },
      username: configService.get<string>('REDIS_USERNAME'),
      password: configService.get<string>('REDIS_PASSWORD'),
    });

    client.on('error', (err) => {
      console.error('Redis 연결 실패:', err);
    });

    await client.connect();
    console.log('Redis 연결 성공');
    return client;
  },
};
