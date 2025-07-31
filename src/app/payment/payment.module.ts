import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentType } from './payment-type.entity';
import { PaymentTypeController } from './payment-type.controller';
import { PaymentTypeService } from './payment-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment,PaymentType])],
  controllers: [PaymentController, PaymentTypeController],
  providers: [PaymentService, PaymentTypeService],
})
export class PaymentModule {}
