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
}
