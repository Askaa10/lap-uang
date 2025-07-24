import { Module } from '@nestjs/common';
import { StudentPaymentService } from './student-payment.service';
import { StudentPaymentController } from './student-payment.controller';

@Module({
  providers: [StudentPaymentService],
  controllers: [StudentPaymentController]
})
export class StudentPaymentModule {}
