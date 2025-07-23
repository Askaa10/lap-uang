import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './auth.dto';
;

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    login(@Body() userLogin: LoginDTO) {
        return this.authService.login(userLogin);
    }

    @Post('change-password')
    changePassword(@Body() userChangePassword: { email: string, oldPassword: string, newPassword: string  }) {
        return this.authService.changePassword(userChangePassword);
    }

    @Post('register')
    register(@Body() userRegister: { email: string, password: string }) {
        return this.authService.register(userRegister);
    }
}
