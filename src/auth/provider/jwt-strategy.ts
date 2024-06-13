import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { Expiry } from 'src/user/entities/expiry.entity';
import { Repository } from 'typeorm';
import { CryptoManager } from 'src/crypto/provider/crypto-manager';
import { ConfigService } from '@nestjs/config';
import { EnvKey } from 'src/common/env.validator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'JWT-1') {
  constructor(
    private configService: ConfigService,
    private readonly authService: AuthService,
    @Inject(Expiry)
    private readonly tokenBlacklistRepository: Repository<Expiry>,
    private readonly cryptomanager: CryptoManager,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: async (
        _request: Request,
        rawJwtToken: any,
        done: (err: any, secretOrKey?: string | Buffer) => void,
      ) => {
        const didEncryptRawJwtToken = await this.cryptomanager.encrypt(
          rawJwtToken,
        );

        const count = await this.tokenBlacklistRepository.findOne({
          where: {
            token: didEncryptRawJwtToken,
          },
        });

        if (!!count) {
          done(new HttpException('이미 만료된 토큰입니다.', 400), '');
        } else {
          done('', this.configService.get<string>(EnvKey.JWT_KEY));
        }
      },
    });
  }

  async validate(payload): Promise<any> {
    console.log('JwtStrategy validate');
    const user = await this.authService.validatePayload(payload);

    if (!user) {
      throw new HttpException('유효하지 않은 payload를 담고 있습니다.', 400);
    }
    return user;
  }
}
