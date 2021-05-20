import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from 'src/configs/jwt-config.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AnonymousStrategy } from './strategies/anonymous.strategy';

@Module({
  providers: [AnonymousStrategy, AuthService, GoogleStrategy, JwtStrategy],
  controllers: [AuthController],
  imports: [
    JwtModule.registerAsync({ useClass: JwtConfigService }),
    UsersModule,
  ],
  exports: [JwtModule],
})
export class AuthModule {}
