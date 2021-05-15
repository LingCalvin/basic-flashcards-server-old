import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ThrottlerModuleOptions,
  ThrottlerOptionsFactory,
} from '@nestjs/throttler';

@Injectable()
export class ThrottlerConfigService implements ThrottlerOptionsFactory {
  constructor(private config: ConfigService) {}
  createThrottlerOptions(): ThrottlerModuleOptions {
    return {
      ttl: this.config.get('THROTTLE_TTL', 60),
      limit: this.config.get('THROTTLE_LIMIT', 1000),
    };
  }
}
