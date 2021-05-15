import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { publicKey } from '../constants/public-key';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request) => req.cookies.accessToken,
      ]),
      ignoreExpiration: false,
      secretOrKey: publicKey,
    });
  }

  async validate({ sub }: JwtPayload) {
    const user = await this.usersService.findOne({ id: sub });
    if (!user || !user.active) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
