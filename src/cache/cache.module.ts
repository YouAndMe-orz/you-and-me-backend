import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheProvider } from './cache.provider';

@Global()
@Module({
  providers: [CacheProvider, CacheService],
  exports: [CacheService, CacheProvider],
})
export class CacheModule {}
