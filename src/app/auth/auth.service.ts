import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDTO, ResetPasswordDTO } from './auth.dto';
import { BaseResponse } from 'src/utils/response/base.response';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { ResetPassword } from './resetPassword.entity';
import { Role } from './auth.enum';


@Injectable()
export class AuthService extends BaseResponse {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(ResetPassword)
    private resetPasswordRepo: Repository<ResetPassword>,

    private jwtService: JwtService,
    private ms: MailService,
  ) {
    super();
  }

  generateJWT(payload: any, expiresIn: string | number, token: string) {
    return this.jwtService.sign(payload, {
      secret: token,
      expiresIn,
    });
  }

  async login(userLogin: LoginDTO) {
    try {
      const user = await this.userRepo.findOne({
        where: { email: userLogin.email },
      });

      if (!user) {
        throw new NotFoundException('Email tidak ditemukan');
      }

      const isPasswordValid = await bcrypt.compare(
        userLogin.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Password salah');
      }

      const jwt_payload = {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      };

      const refresh_token = this.generateJWT(
        jwt_payload,
        7 * 24 * 60 * 60, // 7 days
        process.env.JWT_SECRET,
      );

      const access_token = this.generateJWT(
        jwt_payload,
        1 * 60 * 60, // 1 hour
        process.env.JWT_SECRET,
      );

      user.refresh_token = refresh_token;
      await this.userRepo.save(user);

      return this._success({
        auth: {
          access_token,
          refresh_token,
          alg: 'HS256',
          token_type: 'Bearer',
          typ: 'JWT',
          scope: ['Read', 'Write', 'Delete', 'Update'],
        },
        data: { ...user },
        links: {
          self: '/auth/login',
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async register(userRegister: { email: string; password: string }) {
    const hashedPassword = await bcrypt.hash(userRegister.password, 10);

    const user = this.userRepo.create({
      email: userRegister.email,
      password: hashedPassword,
      username: userRegister.email.split('@')[0],
      role: Role.ADMIN,
    });

    return this.userRepo.save(user);
  }

  async changePassword(userChangePassword: {
    email: string;
    oldPassword: string;
    newPassword: string;
  }) {
    const user = await this.userRepo.findOne({
      where: { email: userChangePassword.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email tidak ditemukan');
    }

    const isPasswordValid = await bcrypt.compare(
      userChangePassword.oldPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Password lama salah');
    }

    user.password = await bcrypt.hash(userChangePassword.newPassword, 10);
    await this.userRepo.save(user);

    return {
      message: 'Password berhasil diubah',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }

  async myProfile(id: string) {
    return this.userRepo.findOne({
      where: { id },
      select: ['id', 'email', 'username'],
    });
  }

  async forgotPassword(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      throw new HttpException(
        'Email tidak ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const token = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit

    await this.ms.sendForgotPassword({
      email: email,
      name: user.username,
      otpToken: token,
      userId: user.id,
    });

    

    const resetEntry = this.resetPasswordRepo.create({
      userId: user.id,
      token,
    });

    await this.resetPasswordRepo.save(resetEntry);

    return this._success({
      auth: null,
      data: { ...user },
      links: {
        self: '/auth/login',
      },
    });
  }

  async resetPassword(
    userId: string,
    token: string,
    payload: ResetPasswordDTO,
  ) {
    const userToken = await this.resetPasswordRepo.findOne({
      where: { userId, token },
    });

    if (!userToken) {
      throw new HttpException(
        'Token tidak valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newHashedPassword = await bcrypt.hash(payload.new_password, 12);

    await this.userRepo.update({ id: userId }, { password: newHashedPassword });

    await this.resetPasswordRepo.delete({ id: userToken.id });

    return this._success({
      auth: null,
      data: { ...payload, userId, token },
      links: {
        self: '/auth/login',
      },
    });
  }
}
