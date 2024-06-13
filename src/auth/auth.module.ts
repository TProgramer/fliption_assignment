import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EnvKey } from 'src/common/env.validator';
import { TokenCreator } from './provider/token-creater';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get(EnvKey.JWT_KEY),
      }),
    }),
  ],
  providers: [TokenCreator],
  exports: [TokenCreator],
})
export class AuthModule {}
