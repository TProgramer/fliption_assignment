import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CryptoModule } from './crypto/crypto.module';
import { ConfigModule } from '@nestjs/config';

import { validate } from './common/env.validator';

import * as path from 'path';
import { DatabaseModule } from './common/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역적으로 환경변수를 불러올 수 있게 설정 (ex. process.env)
      validate,
      envFilePath: path.resolve(`${__dirname}/../.env.local`),
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    CryptoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
