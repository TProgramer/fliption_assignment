import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninDto } from './dto/sign-in.dto';
import { JwtAuthGuard } from 'src/auth/provider/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('sign-up')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.userService.signUp(createUserDto);
  }

  @Post('sign-in')
  signin(@Body() signinDto: SigninDto) {
    return this.userService.signIn(signinDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getMyInfo(@Param('id') id: number) {
    return this.userService.getMyInfo(id);
  }
}
