import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Token } from './entities/token.entity';
import { Expiry } from './entities/expiry.entity';
import { CryptoManager } from 'src/crypto/provider/crypto-manager';
import { SigninDto } from './dto/sign-in.dto';
import { TokenCreator } from 'src/auth/provider/token-creater';

@Injectable()
export class UserService {
  constructor(
    @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
    private readonly cryptoManager: CryptoManager,
    private readonly tokenCreator: TokenCreator,
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
    const didEncryptPassword = await this.cryptoManager.encrypt(
      createUserDto.password,
    );

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
      password: didEncryptPassword,
    });
    didCreateUser.email = createUserDto.email;
    didCreateUser.name = createUserDto.name;

    return didCreateUser;
  }

  async signIn(signinDto: SigninDto) {
    const didEncryptEmail = await this.cryptoManager.encrypt(signinDto.email);
    const didEncryptName = await this.cryptoManager.encrypt(signinDto.name);
    const didEncryptPassword = await this.cryptoManager.encrypt(
      signinDto.password,
    );

    const user = await this.userRepository.findOne({
      where: {
        email: didEncryptEmail,
        name: didEncryptName,
        password: didEncryptPassword,
      },
    });
    if (!user) {
      throw new HttpException('올바르지 않은 유저 정보입니다.', 400);
    }

    // 인증된 유저에게 JWT(Access/Refresh Token) 발행
    const accessToken = this.tokenCreator.createAccessToken(user);
    const refreshToken = this.tokenCreator.createRefreshToken(user);

    const didEncryptAccessToken = await this.cryptoManager.encrypt(accessToken);
    const didEncryptRefreshToken = await this.cryptoManager.encrypt(
      refreshToken,
    );

    // 이미 만료되지않은 JWT가 있다면, 만료 처리 후 로그인 진행
    if (user.token) {
      await this.expiryRepository.insert({
        token: user.token.accessToken,
      });
      await this.expiryRepository.insert({
        token: user.token.refreshToken,
      });

      await this.tokenRepository.delete(user.token.id);
    }

    await this.tokenRepository.save({
      accessToken: didEncryptAccessToken,
      refreshToken: didEncryptRefreshToken,
      user,
    });

    user.email = signinDto.email;
    user.name = signinDto.name;

    return {
      ...user,
      token: {
        accessToken,
        refreshToken,
      },
    };
  }
}
