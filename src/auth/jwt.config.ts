// src/auth/jwt.config.ts
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';

export const jwtModuleAsyncOptions: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService): JwtModuleOptions => {
    const secret = config.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const expiresInEnv = config.get<string>('JWT_EXPIRES_IN');
    const expiresIn = expiresInEnv ? parseInt(expiresInEnv, 10) : 3600;

    return {
      secret,
      signOptions: {
        expiresIn,
      },
    };
  },
};
