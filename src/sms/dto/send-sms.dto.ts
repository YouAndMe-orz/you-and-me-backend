// send-sms.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

export class SendSmsDto {
  @ApiProperty({
    example: '01043925052',
    description: 'SMS를 받을 수신자 번호 (숫자만)',
  })
  @IsPhoneNumber('KR')
  @IsString()
  receiver: string;
}
