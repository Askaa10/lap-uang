import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailService } from './mail.service';
import { mailConfig } from 'src/config/mail.config';
// import { mailConfig } from 'src/config/mail.config';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: mailConfig(),
      defaults: {
        from: process.env.MAIL_FROM || 'Lapuang <lapuang@gmail.com>',
      },
      template: {
dir: join(process.cwd(), 'src', 'mail', 'templates'),
  adapter: new HandlebarsAdapter(),
  options: { strict: true },
},

    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
