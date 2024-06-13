import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Token } from './entities/token.entity';
import { Expiry } from './entities/expiry.entity';
import { CryptoManager } from 'src/crypto/provider/crypto-manager';

@Injectable()
export class UserService {
  constructor(
    @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
    private readonly cryptoManager: CryptoManager,
    @Inject(User)
    private readonly userRepository: Repository<User>,
    @Inject(Token)
    private readonly tokenRepository: Repository<Token>,
    @Inject(Expiry)
    private readonly expiryRepository: Repository<Expiry>,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const didEncryptEmail = await this.cryptoManager.encrypt(
      createUserDto.email,
    );
    const didEncryptName = await this.cryptoManager.encrypt(createUserDto.name);

    // 암호화한 정보가 DB에 이미 존재하는지 확인
    const user = await this.userRepository.findOne({
      where: {
        email: didEncryptEmail,
        name: didEncryptName,
      },
    });

    if (user) {
      throw new HttpException('이미 가입된 유저입니다.', 400);
    }

    // 존재하지 않은 정보라면, DB에 저장하며 가입정보를 반환
    const didCreateUser = await this.userRepository.save({
      email: didEncryptEmail,
      name: didEncryptName,
    });
    didCreateUser.email = createUserDto.email;
    didCreateUser.name = createUserDto.name;

    return didCreateUser;
  }
}
