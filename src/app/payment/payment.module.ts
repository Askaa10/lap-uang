import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Student } from '../student/student.entity';
import { PaymentScheduler } from './payment.scheduler';
import { PaymentHistoryModule } from './payment-history/payment-history.module';
import { PaymentTypeModule } from './payment-type/payment-type.module';
import { PaymentHistory } from './payment-history/payment-history.entity';
import { PaymentType } from './payment-type/payment-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Student, PaymentHistory, PaymentType]),
    PaymentHistoryModule,
    PaymentTypeModule, // ← WAJIB
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentScheduler],
})
export class PaymentModule {}
