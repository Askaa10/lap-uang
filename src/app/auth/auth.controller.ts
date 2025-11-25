import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Query,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDTO,
  ResetPasswordDto,
  VerifyResetTokenDto,
  ForgotPasswordDto,
  ChangePasswordDto,
} from './auth.dto';
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

  @Post('register')
  register(@Body() userRegister: { email: string; password: string }) {
    return this.authService.register(userRegister);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('verify-reset-token')
  @HttpCode(HttpStatus.OK)
  async verifyResetToken(
    @Body('email') email: string,
    @Body() dto: VerifyResetTokenDto,
  ) {
    return this.authService.verifyResetToken(email, dto.token);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body('resetSessionId') resetSessionId: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPasswordWithSession(resetSessionId, newPassword);
  }

  
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    // const userId = req.user.id;
    return this.authService.changePassword(dto);
  }
}
