import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtAccessTokenStrategy } from './jwtAccessToken.strategy';
import { JwtRefreshTokenStrategy } from './jwtRefreshToken.strategy';
import { PassportModule } from '@nestjs/passport';
import { jwt_config } from 'src/config/jwt.config';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.register({
      secret: jwt_config.access_token_secret,
      signOptions: {
        expiresIn: jwt_config.expired,
      },
    }),
    MailModule,
  ],
  providers: [
    AuthService,
    PrismaService,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
