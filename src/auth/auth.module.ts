import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EnvKey } from 'src/common/env.validator';
import { TokenCreator } from './provider/token-creater';
import { CryptoModule } from 'src/crypto/crypto.module';
import { AuthService } from './service/auth.service';
import { JwtStrategy } from './provider/jwt-strategy';
import { User } from 'src/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Token } from 'src/user/entities/token.entity';
import { Expiry } from 'src/user/entities/expiry.entity';
import { DatabaseModule } from 'src/common/database/database.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get(EnvKey.JWT_KEY),
      }),
    }),
    CryptoModule,
    DatabaseModule,
  ],
  providers: [
    TokenCreator,
    AuthService,
    JwtStrategy,
    {
      provide: User,
      useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: Token,
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Token),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: Expiry,
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Expiry),
      inject: ['DATA_SOURCE'],
    },
  ],
  exports: [TokenCreator],
})
export class AuthModule {}
