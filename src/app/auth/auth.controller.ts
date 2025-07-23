import { Admin } from './../../../node_modules/.prisma/client/index.d';
import { Controller, Post, Body, Get, Req, Query, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() userLogin: LoginDto) {
    return this.authService.login(userLogin);
  }

//   JWT PIS JANGAN LUPA
  @Get('profile/:id')
  async profile(@Param('id') id: string) {
    return this.authService.myProfile(id);
  }
}
