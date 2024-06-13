import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// PassportStrategy(Strategy, 'JWT-1')와 결합 됨
export class JwtAuthGuard extends AuthGuard('JWT-1') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    console.log('JwtAuthGuard canActivate');
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || info) {
      throw new HttpException('JWT 인증에 실패했습니다.', 500);
    }
    return user;
  }
}
