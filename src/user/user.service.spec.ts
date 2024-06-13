import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, Repository<User>],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(Repository<User>);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('DB에 존재하지않는 유저라면, 회원가입을 처리한다.', async () => {
    const userRepositoryFindOneSpy = jest
      .spyOn(repository, 'findOne')
      .mockResolvedValue(undefined);

    const savedUser: User = { email: 'test@naver.com', name: 'test' };

    const userRepositorySaveSpy = jest
      .spyOn(repository, 'save')
      .mockResolvedValue(savedUser);

    await service.signUp(savedUser);
  });
});
