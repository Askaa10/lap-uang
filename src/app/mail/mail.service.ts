import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { MailForgotPasswordDTO } from './mail.dto';

@Injectable()
export class MailService {
  constructor(private ms: MailerService) {}

  async sendForgotPassword(payload: MailForgotPasswordDTO) {
    await this.ms.sendMail({
      to: payload.email,
      subject: 'Lupa Password', // subject pada email
      template: './lupa_password.hbs', // template yang digunakan adalah lupa_password, kita bisa memembuat template yang lain
      context: {
        email: payload.email,
        name: payload.name,
        otpToken: payload.otpToken,
        year: new Date().getFullYear(),
        userId: payload.userId, // Menambahkan userId untuk digunakan dalam link reset password
      },
    });
  }
}
