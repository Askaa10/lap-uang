
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
// Add the following import or define the type if it exists elsewhere
import { LoginDTO, ResetPasswordDTO } from './auth.dto';
import { BaseResponse } from 'src/utils/response/base.response';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { hash } from 'bcrypt';

@Injectable()
export class AuthService extends BaseResponse {
  constructor(
    private Ps: PrismaService,
    private jwtService: JwtService,
    private ms: MailService,
  ) {
    super();
  }

  generateJWT(payload: jwtPayload, expiresIn: string | number, token: string) {
    return this.jwtService.sign(payload, {
      secret: token,
      expiresIn: expiresIn,
    });
  }
  async login(userLogin: LoginDTO) {
    try {
      const user = await this.Ps.user.findUnique({
        where: {
          email: userLogin.email,
        },
      });
      // if (!user) {
      //   throw new NotFoundException('Email tidak ditemukan');
      // }
      const isPasswordValid = await bcrypt.compare(
        userLogin.password,
        user.password,
      );
      if (isPasswordValid) {
        const jwt_payload: jwtPayload = {
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

        await this.Ps.user.update({
          where: { id: user.id },
          data: { refresh_token: refresh_token }, // Update lastLogin field
        });

        return this._success({
          auth: {
            access_token: access_token,
            refresh_token: refresh_token,
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
      } else {
        throw new UnauthorizedException('Password salah');
      }
    } catch (error) {
      console.log(error);
      // throw new NotFoundException('User not found');
    }
  }

  async register(userRegister: { email: string; password: string }) {
    const hashedPassword = await bcrypt.hash(userRegister.password, 10);
    const user = await this.Ps.user.create({
      data: {
        email: userRegister.email,
        password: hashedPassword,
        username: userRegister.email.split('@')[0],
      },
    });
    return user;
  }

  async changePassword(userChangePassword: {
    email: string;
    oldPassword: string;
    newPassword: string;
  }) {
    // Cari user berdasarkan email
    const user = await this.Ps.user.findUnique({
      where: {
        email: userChangePassword.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email tidak ditemukan');
    }

    // Cek apakah oldPassword cocok dengan password di database
    const isPasswordValid = await bcrypt.compare(
      userChangePassword.oldPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password lama salah');
    }

    // Hash password baru
    const hashedNewPassword = await bcrypt.hash(
      userChangePassword.newPassword,
      10,
    );

    // Update password
    await this.Ps.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });

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
    const user = await this.Ps.user.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });
    return user;
  }

  async forgotPassword(email: string) {
    const user = await this.Ps.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new HttpException(
        'Email tidak ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const token = Math.floor(100000 + Math.random() * 900000); // membuat token
    await this.ms.sendForgotPassword({
      email: email,
      name: user.username,
      otpToken: token,
      userId: user.id,
    });

    await this.Ps.resetPassword.create({
      data: {
        userId: user.id,
        token: `${token}`,
      },
    }); // menyimpan token dan id ke tabel reset password

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
    const userToken = await this.Ps.resetPassword.findFirst({
      //cek apakah user_id dan token yang sah pada tabel reset password
      where: {
        userId: userId,
        token: token,
      },
    });

    if (!userToken) {
      throw new HttpException(
        'Token tidak valid',
        HttpStatus.UNPROCESSABLE_ENTITY, // jika tidak sah , berikan pesan token tidak valid
      );
    }

    payload.new_password = await hash(payload.new_password, 12); //hash password
    await this.Ps.user.update({
      // ubah password lama dengan password baru
      data: {
        password: payload.new_password,
      },
      where: {
        id: userId,
      },
    });
    await this.Ps.resetPassword.delete({
      // hapus semua token pada tabel reset password yang mempunyai user_id yang dikirim, agar tidak bisa digunakan kembali
      where: {
        id: userId,
      },
    });

    return this._success({
      auth: null,
      data: { ...payload, userId, token },
      links: {
        self: '/auth/login',
      },
    });
  }
}

