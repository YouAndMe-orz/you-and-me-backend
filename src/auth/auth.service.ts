import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto, VerifyDto } from './dto/sign-up.dto';
import { LoginType } from 'src/configs/login.type';
import { RedisClientType } from 'redis';
import { REDIS_CLIENT } from 'src/cache/cache.provider';
import * as bcrypt from 'bcrypt';
import { getAuthConstant } from 'src/constants/auth.constant';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private authConstant;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(REDIS_CLIENT) private readonly redis: RedisClientType,
    private readonly configService: ConfigService,
  ) {
    this.authConstant = getAuthConstant(configService);
  }

  async signUp(dto: SignUpDto) {
    const { loginType, phoneNum, password, name } = dto;

    // 소셜 or 휴대폰 번호 로 회원가입시 필수 입력사항을 서비스 단계에서 처리함
    if (loginType === LoginType.PHONE && !phoneNum) {
      throw new BadRequestException('휴대폰 번호가 필요합니다.');
    }

    const isExistPhone = await this.userRepository.findOne({
      where: { phoneNum },
    });
    if (isExistPhone) {
      throw new BadRequestException('사용중인 번호입니다');
    }

    // 휴대폰 로그인만 휴대폰 번호와 인증이 필요
    if (!phoneNum) {
      throw new BadRequestException('휴대폰 번호가 필요합니다.');
    }

    const isVerified = await this.redis.get(`verified:phone:${phoneNum}`);
    if (!isVerified) {
      throw new BadRequestException('휴대폰 번호 인증이 필요합니다.');
    }

    if (password.length !== 6) {
      throw new BadRequestException('비밀번호는 6자리 이어야합니다');
    }
    const hashedPassword = await bcrypt.hash(
      password,
      Number(this.authConstant.saltRound),
    );

    const userData = {
      name,
      loginType,
      phoneNum,
      password: hashedPassword,
    };
    await this.userRepository.save(userData);
    userData.password = undefined;
    return userData;
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
