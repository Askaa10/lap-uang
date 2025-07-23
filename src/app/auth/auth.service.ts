import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
// Add the following import or define the type if it exists elsewhere
import { LoginDTO } from './auth.dto';

@Injectable()
export class AuthService extends BaseResponse {
  jwtService: any;
  constructor(private Ps: PrismaService) {
    super();
  }
  async login(userLogin: LoginDTO) {
    const user = await this.Ps.user.findUnique({
      where: {
        email: userLogin.email,
      },
    });
    if (!user) {
      throw new NotFoundException('Email tidak ditemukan');
    }
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
        '7d',
        process.env.JWT_SECRET,
      );
      const access_token = this.generateJWT(
        jwt_payload,
        '1h',
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
          scope: ["Read", "Write", "Delete", "Update"],
        },
        data: { ...user },
        links: {
          self: '/auth/login',
        },
      });
    }
  }

  generateJWT(payload: jwtPayload, expiresIn: string | number, token: string) {
    return this.jwtService.sign(payload, {
      secret: token,
      expiresIn: expiresIn,
    });
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
}
