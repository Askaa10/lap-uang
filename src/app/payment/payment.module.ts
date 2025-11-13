import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentType } from './payment-type/payment-type.entity';
import { PaymentTypeController } from './payment-type/payment-type.controller';
import { PaymentTypeService } from './payment-type/payment-type.service';
import { Student } from '../student/student.entity';
import { PaymentHistoryModule } from './payment-history/payment-history.module';
import { PaymentHistory } from './payment-history/payment-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment,PaymentType,Student,PaymentHistory]), PaymentHistoryModule],
  controllers: [PaymentController, PaymentTypeController],
  providers: [PaymentService, PaymentTypeService],
})
export class PaymentModule {}
