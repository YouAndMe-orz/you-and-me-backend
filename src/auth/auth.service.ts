import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto, VerifyDto } from './dto/sign-up.dto';
import { LoginType } from 'src/configs/login.type';
import { RedisClientType } from 'redis';
import { REDIS_CLIENT } from 'src/cache/cache.provider';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(REDIS_CLIENT) private readonly redis: RedisClientType,
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

    // 휴대폰 로그인만 휴대폰 번호와 인증이 필요
    if (loginType === LoginType.PHONE) {
      if (!phoneNum) {
        throw new BadRequestException('휴대폰 번호가 필요합니다.');
      }

      const isVerified = await this.redis.get(`verified:phone:${phoneNum}`);
      if (!isVerified) {
        throw new BadRequestException('휴대폰 번호 인증이 필요합니다.');
      }
    }
    const userData = {
      name,
      loginType,
      phoneNum,
      email,
      socialId,
      profileImage,
    };
    await this.userRepository.save(userData);

    return;
  }

  async verify(verifyDto: VerifyDto): Promise<boolean> {
    const { phoneNum, code } = verifyDto;
    const storedCode = await this.redis.get(`sms:verify:${phoneNum}`);
    const isValid = storedCode === code;

    if (isValid) {
      await this.redis.set(`verified:phone:${phoneNum}`, 'true', { EX: 300 });
    }

    return isValid;
  }
}
