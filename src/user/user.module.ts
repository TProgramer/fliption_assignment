import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/common/database/database.module';
import { User } from './entities/user.entity';
import { DataSource } from 'typeorm';
import { Token } from './entities/token.entity';
import { Expiry } from './entities/expiry.entity';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    UserService,
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
})
export class UserModule {}
