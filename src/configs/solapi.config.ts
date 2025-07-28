import { ConfigService } from '@nestjs/config';

export const getSolapiConfig = (configService: ConfigService) => ({
  apiKey: configService.get('SOLAPI_API_KEY'),
  secretKey: configService.get('SOLAPI_SECRET_KEY'),
  senderPhoneNum: configService.get('SENDER_PHONE_NUM'),
});
