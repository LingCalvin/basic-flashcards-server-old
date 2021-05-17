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
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller('auth')
@Throttle(
  +process.env.AUTHENTICATION_THROTTLE_LIMIT,
  +process.env.AUTHENTICATION_THROTTLE_TTL,
)
export class AuthController {
  constructor(private authService: AuthService, private jwt: JwtService) {}

  @Post('access-tokens')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {
    const accessToken = await this.authService.loginOrRegister(req.user);
    return { accessToken, decodedAccessToken: this.jwt.decode(accessToken) };
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
