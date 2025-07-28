import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, VerifyDto } from './dto/sign-up.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('01.auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 휴대폰번호로 시작하기 (회원가입)
   * @param sinUpDTO
   * @returns
   */
  @ApiCreatedResponse({
    description: '회원가입 성공',
    schema: {
      example: {
        success: true,
        user: {
          id: 1,
          name: '조민수',
          loginType: 'PHONE',
          phoneNum: '01012345678',
          email: null,
          profileImage: 'https://cdn.../profile.jpg',
          createdAt: '2025-07-28T07:34:00.000Z',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: `회원가입 실패 예시:
  - 휴대폰 로그인인데 번호 누락
  - 소셜 로그인인데 email 또는 socialId 누락
  - 이미 가입된 사용자
  - 휴대폰 인증 안 됨`,
    schema: {
      example: {
        statusCode: 400,
        message: '소셜 로그인 정보가 부족합니다.',
        error: 'Bad Request',
      },
    },
  })
  @Post('/sign-up')
  async signIn(@Body() signUpDto: SignUpDto) {
    const data = await this.authService.signUp(signUpDto);
    return {
      status: HttpStatus.CREATED,
      message: '회원가입에 성공하였습니다',
      data,
    };
  }

  /**
   * 휴대폰 번호 인증
   * @param verifyDto
   * @returns
   */
  @ApiOkResponse({
    description: '인증 성공 여부 반환',
    schema: {
      example: {
        success: true,
        verified: true,
      },
    },
  })
  @ApiBadRequestResponse({
    description: '인증 실패',
    schema: {
      example: {
        statusCode: 400,
        message: '인증번호가 올바르지 않습니다.',
        error: 'Bad Request',
      },
    },
  })
  @Post('/verify')
  async verify(@Body() verifyDto: VerifyDto) {
    return await this.authService.verify(verifyDto);
  }
}
