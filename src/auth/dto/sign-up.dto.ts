import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { LoginType } from 'src/configs/login.type';

export class SignUpDto {
  @IsNotEmpty()
  @IsEnum(LoginType)
  loginType: LoginType = LoginType.PHONE;

  @IsOptional()
  @IsPhoneNumber('KR')
  phoneNum?: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  name!: string;
}

export class VerifyDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  phoneNum: string;
}
