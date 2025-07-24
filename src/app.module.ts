import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './app/prisma/prisma.module';
import { AuthModule } from './app/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { SiswaModule } from './app/siswa/siswa.module';
import { SchoolModule } from './app/school/school.module';
import { SchoolFeeModule } from './app/school-fee/school-fee.module';
import { FeeGroupModule } from './app/fee-group/fee-group.module';
import { StudentPaymentModule } from './app/student-payment/student-payment.module';
import { MasterDataModule } from './app/master-data/master-data.module';

@Module({
  imports: [PrismaModule, AuthModule, SiswaModule, SchoolModule, SchoolFeeModule, FeeGroupModule, StudentPaymentModule, MasterDataModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
