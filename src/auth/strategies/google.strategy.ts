import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(request) {
    const {
      body: { idToken },
    } = request;
    try {
      return this.authService.verifyIdToken(idToken);
    } catch {
      throw new UnauthorizedException();
    }
  }
}
