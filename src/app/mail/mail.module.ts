import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { mailConfig } from 'src/config/mail.config';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: mailConfig,
      defaults: {
        from: '"Lap-uang" <daffahafizhfirdaus07@gmail.com>',
      },
      template: {
        dir: join(__dirname, 'templates'), // template akan di ambil dari handlebar yang ada pada folder templates
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService], // 👈 export  mailService agar bisa digunakan di luar module mail
})
export class MailModule {}
