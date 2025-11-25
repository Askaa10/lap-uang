import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './app/auth/auth.module';
import { SchoolProfileModule } from './app/school-profile/school-profile.module';
import { StudentModule } from './app/student/student.module';
import { PaymentModule } from './app/payment/payment.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceiptsModule } from './app/receipts/receipts.module';
import { ExpenseModule } from './app/expense/expense.module';
import { InitialBalanceModule } from './app/initial-balance/initial-balance.module';
import { CloudinaryModule } from './app/cloudinary/cloudinary.module';
import { SppPaymentModule } from './app/spp-payment/spp-payment.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ProfileModule } from './app/profile/profile.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PaymentTypeModule } from './app/payment/payment-type/payment-type.module';
import { PaymentHistoryModule } from './app/payment/payment-history/payment-history.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // konfigurasi is global untuk semua module
    }),
    MailerModule,
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const { typeOrmConfig } = await import('./config/typeorm.config');
        return { ...typeOrmConfig, synchronize: true, autoLoadEntities: true };
      },
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    MailModule,
    SppPaymentModule,
    SchoolProfileModule,
    StudentModule,
    PaymentModule,
    ReceiptsModule,
    ExpenseModule,
    InitialBalanceModule,
    // CloudinaryModule,
    SppPaymentModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
