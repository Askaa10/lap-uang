import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentType } from './payment-type/payment-type.entity';
import { PaymentTypeController } from './payment-type/payment-type.controller';
import { PaymentTypeService } from './payment-type/payment-type.service';
import { Student } from '../student/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment,PaymentType,Student])],
  controllers: [PaymentController, PaymentTypeController],
  providers: [PaymentService, PaymentTypeService],
})
export class PaymentModule {}
