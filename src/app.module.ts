import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CryptoModule } from './crypto/crypto.module';

@Module({
  imports: [UserModule, AuthModule, CryptoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
