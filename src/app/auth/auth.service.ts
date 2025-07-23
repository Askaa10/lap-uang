import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private Ps: PrismaService,
    private jwtService: JwtService,
  ) {}

  generateJWT(payload: jwtPayload, expiresIn: string | number, token: string) {
    return this.jwtService.sign(payload, {
      secret: token,
      expiresIn: expiresIn,
    });
  }accessor
  async login(userLogin: { email: string, password: string }) {
    const user = await this.Ps.admin.findUnique({
      where: {
        email: userLogin.email,
      },
    });
    if (!user || !(await bcrypt.compare(userLogin.password, user.password))) {
      throw new UnauthorizedException('Email atau password salah');
    }
    return{
      message: 'Login berhasil',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    }
  }

  async changePassword(userChangePassword: { email: string, oldPassword: string, newPassword: string }) {
    // Cari user berdasarkan email
    const user = await this.Ps.admin.findUnique({
      where: {
        email: userChangePassword.email,
      },
    });
  
    if (!user) {
      throw new UnauthorizedException('Email tidak ditemukan');
    }
  
    // Cek apakah oldPassword cocok dengan password di database
    const isPasswordValid = await bcrypt.compare(userChangePassword.oldPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password lama salah');
    }
  
    // Hash password baru
    const hashedNewPassword = await bcrypt.hash(userChangePassword.newPassword, 10);
  
    // Update password
    await this.Ps.admin.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });
  
    return {
      message: 'Password berhasil diubah',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
  
  async register(userRegister: { email: string, password: string }) {
    const hashedPassword = await bcrypt.hash(userRegister.password, 10);
    const user = await this.Ps.admin.create({
      data: {
        email: userRegister.email,
        password: hashedPassword,
        name: userRegister.email.split('@')[0],
      },
    });
    return user;
  }

}

