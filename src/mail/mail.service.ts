import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailer: MailerService) {}

  async sendForgotPassword(
    email: string,
    name: string,
    token: string,
    userId?: string,
  ) {
    return this.mailer.sendMail({
      to: email,
      subject: 'Reset Password - LapUang',
      template: 'forgot_password',
      context: {
        name,
        token,
        userId,
        email,
        year: new Date().getFullYear(),
      },
    });
  }
}
