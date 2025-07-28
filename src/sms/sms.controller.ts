import { Body, Controller, Post } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SendSmsDto } from './dto/send-sms.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('2.SMS')
@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  /**
   *  회원가입 인증번호 전송
   * @param receiver
   * @returns
   * @example 01043925052
   */
  @ApiCreatedResponse({
    description: '인증번호 발급 성공',
    schema: {
      example: {
        success: true,
      },
    },
  })
  @ApiBadRequestResponse({
    description: '인증코드 발급 실패',
    schema: {
      example: {
        statusCode: 400,
        message: '인증코드 발급에 실패하였습니다.',
        error: 'Bad Request',
      },
    },
  })
  @Post('/verify')
  async sendSms(
    @Body() receiver: SendSmsDto,
  ): Promise<{ success: boolean; code?: string }> {
    return await this.smsService.send(receiver);
  }
}
