import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentHistory } from './payment-history.entity';
import { PaymentHistoryService } from './payment-history.service';
import { PaymentHistoryController } from './payment-history.controller';
import { Payment } from '../payment.entity';
import { Student } from 'src/app/student/student.entity';
import { PaymentType } from '../payment-type/payment-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentHistory, Payment, Student, PaymentType]),
  ],
  providers: [PaymentHistoryService],
  controllers: [PaymentHistoryController],
  exports: [PaymentHistoryService],
})
export class PaymentHistoryModule {}
