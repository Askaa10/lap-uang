import { MailForgotPasswordDTO } from '../../mail/mail.dto';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { LoginDTO, ResetPasswordDto, ChangePasswordDto } from './auth.dto';
import { BaseResponse } from '../../utils/response/base.response';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../../mail/mail.service';
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
      await this.userRepo.update(user.id, { refresh_token });

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

  
  async myProfile(id: string) {
    return this.userRepo.findOne({
      where: { id },
      select: ['id', 'email', 'username'],
    });
  }

async forgotPassword(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new BadRequestException('Email tidak ditemukan');

    await this.resetPasswordRepo.delete({ userId: user.id });

    const token = Math.floor(100000 + Math.random() * 900000).toString();

    const record = this.resetPasswordRepo.create({
      userId: user.id,
      token,
    });

    await this.resetPasswordRepo.save(record);
    // send email with token; catch errors from mailer and log for debugging
    try {
      const sendResult = await this.ms.sendForgotPassword(
        email,
        user.username,
        token,
        user.id,
      );

      if (process.env.NODE_ENV !== 'production') {
        console.log('ForgotPassword: token generated', { userId: user.id, token });
        console.log('ForgotPassword: mailer result', sendResult);
      }
    } catch (err) {
      console.error('Failed to send forgot password email', err);
      // optionally remove the saved record so user can retry
      // await this.resetPasswordRepo.delete({ userId: user.id });
      throw new HttpException(
        'Gagal mengirim email reset password',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { message: 'Kode telah dikirim ke email' };
  }




  async resetPasswordWithSession(resetSessionId: string, newPassword: string) {
  const rec = await this.resetPasswordRepo.findOne({
    where: { sessionId: resetSessionId },
  });

  if (!rec) throw new BadRequestException("Session tidak valid");

  const diff = (Date.now() - rec.sessionCreatedAt.getTime()) / 1000;
  if (diff > 300) throw new BadRequestException("Session expired");

  const user = await this.userRepo.findOne({ where: { id: rec.userId } });

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;

  await this.userRepo.save(user);
  await this.resetPasswordRepo.delete({ id: rec.id });

  return { message: "Password berhasil diubah" };
}

  // Verify a reset token. Accepts { userId?: string, email?: string, token: string }
 async verifyResetToken(email: string, token: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new BadRequestException('User tidak ditemukan');

    const rec = await this.resetPasswordRepo.findOne({
      where: { userId: user.id, token },
    });

    if (!rec) throw new BadRequestException('Token salah');

    const diff = (Date.now() - rec.createdAt.getTime()) / 1000;
    if (diff > 60) throw new BadRequestException('Token kedaluwarsa');

    const sessionId = crypto.randomUUID();

    rec.token = null;
    rec.sessionId = sessionId;
    rec.sessionCreatedAt = new Date();

    await this.resetPasswordRepo.save(rec);

    return {
      message: 'Token valid',
      resetSessionId: sessionId,
    };
  }

async changePassword(dto: ChangePasswordDto) {
  const user = await this.userRepo.findOne({ where: { email: dto.email } });

  if (!user) throw new NotFoundException("User tidak ditemukan");

  // Hash password baru
  const hashed = await bcrypt.hash(dto.newPassword, 10);

  // Generate resetSessionId otomatis
  const newResetSessionId = crypto.randomBytes(32).toString("hex");

  user.password = hashed;
  user.resetSessionId = newResetSessionId;

  await this.userRepo.save(user);

  return {
    message: "Password berhasil diubah",
    resetSessionId: newResetSessionId,
  };
}

}

