import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { publicKey } from '../constants/public-key';
import { TokenUse } from '../enums/token-use';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: publicKey,
    });
  }

  async validate({ sub, use, check, jti }: JwtPayload) {
    const user = await this.usersService.findOne({ id: sub });
    if (
      (await this.authService.checkTokenRevoked(jti)) ||
      !user ||
      !user.active ||
      use !== TokenUse.Access ||
      user.check !== check
    ) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
