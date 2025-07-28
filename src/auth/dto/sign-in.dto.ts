import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsPhoneNumber('KR')
  phoneNum: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
