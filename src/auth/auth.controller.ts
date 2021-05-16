import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
@Throttle(
  +process.env.AUTHENTICATION_THROTTLE_LIMIT,
  +process.env.AUTHENTICATION_THROTTLE_TTL,
)
export class AuthController {
  constructor(private authService: AuthService, private jwt: JwtService) {}

  @Post('access-tokens')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req, @Res({ passthrough: true }) res: Response) {
    const accessToken = await this.authService.loginOrRegister(req.user);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: true,
    });
    return { accessToken, decodedAccessToken: this.jwt.decode(accessToken) };
  }

  @Get('token-info')
  @UseGuards(JwtAuthGuard)
  verifyAccessToken(@Req() { user }: Request) {
    return { sub: user.id };
  }
}
