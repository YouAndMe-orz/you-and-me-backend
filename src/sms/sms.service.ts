import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SolapiMessageService } from 'solapi';
import { getSolapiConfig } from 'src/configs/solapi.config';
import { generateRandomCode } from 'src/util/auth.util';
import { SendSmsDto } from './dto/send-sms.dto';

@Injectable()
export class SmsService {
  private readonly messageService: SolapiMessageService;
  private readonly solapiConfig;

  constructor(private readonly configService: ConfigService) {
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

      return { success: true, code: verificationCode };
    } catch (error) {
      console.error('SMS 전송 실패:', error);
      return { success: false };
    }
  }
}
