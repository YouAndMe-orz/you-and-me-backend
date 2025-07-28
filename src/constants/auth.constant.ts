import { ConfigService } from '@nestjs/config';

export const getAuthConstant = (configService: ConfigService) => ({
  saltRound: configService.get<number>('SALT_ROUND'),
});
