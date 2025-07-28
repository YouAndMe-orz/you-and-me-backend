import { Body, Controller, Post } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SendSmsDto } from './dto/send-sms.dto';

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  /**
   *  회원가입 인증번호 전송
   * @param receiver
   * @returns
   * @example 01043925052
   */
  @Post('/verify')
  async sendSms(
    @Body() receiver: SendSmsDto,
  ): Promise<{ success: boolean; code?: string }> {
    return await this.smsService.send(receiver);
  }
}
