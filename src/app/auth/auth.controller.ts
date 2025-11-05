import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, ResetPasswordDTO } from './auth.dto';
import { JwtGuard } from './auth.guard';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from './roles.guard';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //   JWT PIS JANGAN LUPA
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('profile/:id')
  async profile(@Param('id') id: string) {
    return await this.authService.myProfile(id);
  }
  
  @Post('login')
  async login(@Body() userLogin: LoginDTO) {
    return await this.authService.login(userLogin);
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

  @Post('forgot-password')
  async forgotPassowrd(@Body('email') email: string) {
    console.log('email', email);
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password/:user_id/:token') // url yang dibuat pada endpont harus sama dengan ketika kita membuat link pada service forgotPassword
  async resetPassword(
    @Param('user_id') user_id: string,
    @Param('token') token: string,
    @Body() payload: ResetPasswordDTO,
  ) {
    return this.authService.resetPassword(user_id, token, payload);
  }
}
