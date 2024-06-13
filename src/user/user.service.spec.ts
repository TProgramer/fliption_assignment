import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { HttpException } from '@nestjs/common';

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
    const savedUser: User = {
      email: 'test@naver.com',
      name: 'test',
      password: 'testpass',
    };
    const userRepositoryFindOneSpy = jest
      .spyOn(repository, 'findOne')
      .mockResolvedValue(undefined);

    const userRepositorySaveSpy = jest
      .spyOn(repository, 'save')
      .mockResolvedValue(savedUser);

    const res = await service.signUp(savedUser);
    expect(res).toBe(savedUser);
  });

  it('DB에 존재하는 유저라면, 에러메세지와 함께 400을 반환한다.', async () => {
    const savedUser: User = {
      email: 'test@naver.com',
      name: 'test',
      password: 'testpass',
    };

    const userRepositoryFindOneSpy = jest
      .spyOn(repository, 'findOne')
      .mockResolvedValue(savedUser);

    try {
      await service.signUp(savedUser);
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      expect(err.message).toBe('이미 가입된 유저입니다.');
    }
  });

  it('DB에 존재하는 유저가 로그인 요청을 하면, JWT를 헤더에 담아 반환한다.', async () => {
    const savedUser: User = {
      email: 'test@naver.com',
      name: 'test',
      password: 'testpass',
    };
    const userRepositoryFindOneSpy = jest
      .spyOn(repository, 'findOne')
      .mockResolvedValue(undefined);

    const res = await service.signIn(savedUser);
    expect(res).toBe(savedUser);
  });
});
