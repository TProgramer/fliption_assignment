import { Module } from '@nestjs/common';
import { KmsManager } from './provider/kms-manager';
import { HttpModule } from '@nestjs/axios';
import { CryptoController } from './controller/crypto.controller';
import { CryptoManager } from './provider/crypto-manager';

@Module({
  imports: [HttpModule],
  controllers: [CryptoController],
  providers: [KmsManager, CryptoManager],
  exports: [CryptoManager],
})
export class CryptoModule {}
