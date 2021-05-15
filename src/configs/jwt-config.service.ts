import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { privateKey } from '../auth/constants/private-key';
import { publicKey } from '../auth/constants/public-key';
@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private readonly config: ConfigService) {}
  createJwtOptions(): JwtModuleOptions {
    return {
      signOptions: {
        issuer: this.config.get('JWT_ISSUER'),
        expiresIn: this.config.get('JWT_EXPIRES_IN', '1d'),
        algorithm: this.config.get('JWT_SIGNING_ALGORITHM', 'RS256'),
      },
      verifyOptions: {
        issuer: this.config.get('JWT_ISSUER'),
        algorithms: [this.config.get('JWT_SIGNING_ALGORITHM', 'RS256')],
      },
      publicKey,
      privateKey,
    };
  }
}
