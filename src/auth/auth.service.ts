import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { googleOAuth2Client } from './constants/google-oauth2-client';
import { TokenPayload } from 'google-auth-library';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService, private usersService: UsersService) {}

  async verifyIdToken(idToken: string): Promise<TokenPayload> {
    const ticket = await googleOAuth2Client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  }

  async register(tokenPayload: TokenPayload) {
    return this.usersService.create({
      googleId: tokenPayload.sub,
      email: tokenPayload.email,
    });
  }

  async loginOrRegister(tokenPayload: TokenPayload) {
    let user = await this.usersService.findOne({
      googleId: tokenPayload.sub,
    });

    if (!user) {
      user = await this.register(tokenPayload);
    }

    // exp will be set when the token is signed
    const responseTokenPayload: Omit<JwtPayload, 'exp'> = {
      jti: uuidv4(),
      sub: user.id,
    };

    return this.jwt.signAsync(responseTokenPayload);
  }
}
