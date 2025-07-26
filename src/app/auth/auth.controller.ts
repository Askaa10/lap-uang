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
import { LoginDTO } from './auth.dto';
import { JwtGuard } from './auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from './roles.guard';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //   JWT PIS JANGAN LUPA
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('profile/:id')
  async profile(@Param('id') id: string) {
    return await  this.authService.myProfile(id);
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
}
