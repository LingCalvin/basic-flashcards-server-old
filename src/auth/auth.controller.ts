import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { VerifyAccessTokenDto } from './dto/verify-access-token.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
@Throttle(
  +process.env.AUTHENTICATION_THROTTLE_LIMIT,
  +process.env.AUTHENTICATION_THROTTLE_TTL,
)
export class AuthController {
  constructor(private authService: AuthService, private jwt: JwtService) {}

  @Post('access-tokens')
  @UseGuards(LocalAuthGuard)
  async login(@Req() { user }) {
    return this.authService.createAccessToken(user);
  }

  @Get('access-tokens/:token')
  async verifyAccessToken(@Param() { token }: VerifyAccessTokenDto) {
    try {
      return await this.jwt.verifyAsync(token);
    } catch {
      throw new NotFoundException();
    }
  }
}
