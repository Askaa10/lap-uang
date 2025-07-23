import { Admin } from './../../../node_modules/.prisma/client/index.d';
import { Controller, Post, Body, Get, Req, Query, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './auth.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //   JWT PIS JANGAN LUPA
  @Get('profile/:id')
  async profile(@Param('id') id: string) {
    return this.authService.myProfile(id);
  }
  @Post('login')
  login(@Body() userLogin: LoginDTO) {
    return this.authService.login(userLogin);
  }

  @Post('change-password')
  changePassword(
    @Body()
    userChangePassword: {
      email: string;
      oldPassword: string;
      newPassword: string;
    },
  ) {
    return this.authService.changePassword(userChangePassword);
  }

  @Post('register')
  register(@Body() userRegister: { email: string; password: string }) {
    return this.authService.register(userRegister);
  }
}
