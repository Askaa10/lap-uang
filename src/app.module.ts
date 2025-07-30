import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './app/auth/auth.module';
import { MailModule } from './app/mail/mail.module';
import { SchoolProfileModule } from './app/school-profile/school-profile.module';
import { StudentModule } from './app/student/student.module';
import { PaymentModule } from './app/payment/payment.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // konfigurasi is global untuk semua module
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const { typeOrmConfig } = await import('./config/typeorm.config');
        return typeOrmConfig;
      },
    }),
    AuthModule,
    MailModule,
    SchoolProfileModule,
    StudentModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
