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
import { ReceiptsModule } from './app/receipts/receipts.module';
import { ArrearModule } from './app/arrear/arrear.module';
import { ExpenseModule } from './app/expense/expense.module';
import { InitialBalanceModule } from './app/initial-balance/initial-balance.module';
import { CloudinaryModule } from './app/cloudinary/cloudinary.module';
import { UploadModule } from './app/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // konfigurasi is global untuk semua module
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
    ReceiptsModule,
    ArrearModule,
    ExpenseModule,
    InitialBalanceModule,
    CloudinaryModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
