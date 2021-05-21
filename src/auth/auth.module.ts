import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from 'src/configs/jwt-config.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [AnonymousStrategy, AuthService, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
  imports: [
    JwtModule.registerAsync({ useClass: JwtConfigService }),
    PrismaModule,
    UsersModule,
  ],
  exports: [JwtModule],
})
export class AuthModule {}
