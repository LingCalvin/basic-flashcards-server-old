import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { v4 as uuidv4 } from 'uuid';
import * as argon2 from 'argon2';
import { User } from '@prisma/client';
import { TokenUse } from './enums/token-use';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async checkTokenRevoked(jti: string): Promise<boolean> {
    return (
      (await this.prisma.revokedTokens.findUnique({ where: { jti } })) !== null
    );
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOne({
      username,
    });
    if (!user) {
      return null;
    }
    try {
      const validPassword = await argon2.verify(user.password, password);
      return validPassword ? user : null;
    } catch {
      return null;
    }
  }

  async createAccessToken(user: User) {
    // exp will be set when the token is signed
    const payload: Omit<JwtPayload, 'exp'> = {
      jti: uuidv4(),
      sub: user.id,
      use: TokenUse.Access,
      check: user.check,
    };
    return this.jwt.signAsync(payload);
  }
}
