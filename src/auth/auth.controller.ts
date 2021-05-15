import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('access-tokens')
  @Throttle(5, 30)
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req, @Res({ passthrough: true }) res: Response) {
    const accessToken = await this.authService.loginOrRegister(req.user);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: true,
    });
    return accessToken;
  }
}
