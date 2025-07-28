import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SolapiMessageService } from 'solapi';
import { getSolapiConfig } from 'src/configs/solapi.config';
import { generateRandomCode } from 'src/util/auth.util';
import { SendSmsDto } from './dto/send-sms.dto';
import { REDIS_CLIENT } from 'src/cache/cache.provider';
import { RedisClientType } from 'redis';

@Injectable()
export class SmsService {
  private readonly messageService: SolapiMessageService;
  private readonly solapiConfig;

  constructor(
    private readonly configService: ConfigService,
    @Inject(REDIS_CLIENT) private readonly redis: RedisClientType,
  ) {
    this.solapiConfig = getSolapiConfig(configService);
    this.messageService = new SolapiMessageService(
      this.solapiConfig.apiKey,
      this.solapiConfig.secretKey,
    );
  }

  async send(dto: SendSmsDto): Promise<{ success: boolean; code?: string }> {
    try {
      const verificationCode = generateRandomCode(6);
      const message = `[YOU&ME] 인증코드: ${verificationCode}`;
      console.log(this.solapiConfig.senderPhoneNum);
      console.log(typeof this.solapiConfig.senderPhoneNum);

      await this.messageService.send({
        to: dto.receiver,
        from: this.solapiConfig.senderPhoneNum,
        text: message,
      });

      await this.redis.set(
        `sms:verify:${dto.receiver}`, // 레디스에 저장된 key
        verificationCode, // 인증코드
        { EX: 180 }, // TTL 3분
      );

      return { success: true };
    } catch (error) {
      console.error('SMS 전송 실패:', error);
      return { success: false };
    }
  }
}
