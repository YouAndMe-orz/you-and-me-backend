import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginType } from 'src/configs/login.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async signUp(dto: SignUpDto) {
    const { loginType, phoneNum, email, socialId, name, profileImage } = dto;

    // 소셜 or 휴대폰 번호 로 회원가입시 필수 입력사항을 서비스 단계에서 처리함
    if (loginType === LoginType.PHONE && !phoneNum) {
      throw new BadRequestException('휴대폰 번호가 필요합니다.');
    }

    if (loginType !== LoginType.PHONE && (!email || !socialId)) {
      throw new BadRequestException('소셜 로그인 정보가 부족합니다.');
    }
  }
  return;
}
