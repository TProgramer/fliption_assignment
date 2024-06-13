import { HttpException, Inject, Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @Inject(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validatePayload(payload): Promise<any> {
    const { userId, exp } = payload;
    const user = await this.userRepository.findOne(userId);

    if (new Date(exp) <= new Date()) {
      throw new HttpException('만료된 토큰입니다.', 400);
    }
    return user;
  }
}
