import {
  IsEmail,
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
  loginType: LoginType;

  @IsOptional()
  @IsPhoneNumber('KR')
  phoneNum?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  socialId?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

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
