import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Student } from '../student/student.entity';
import { PaymentScheduler } from './payment.scheduler';
import { PaymentHistoryService } from './payment-history/payment-history.service';
import { PaymentHistoryController } from './payment-history/payment-history.controller';
import { PaymentHistory } from './payment-history/payment-history.entity';
import { PaymentTypeService } from './payment-type/payment-type.service';
import { PaymentType } from './payment-type/payment-type.entity';
import { PaymentTypeController } from './payment-type/payment-type.controller';
import { SppPayment } from '../spp-payment/spp-payment.entity';
// import { PaymentHistoryModule } from './payment-history/payment-history.module';


@Module({
  imports: [TypeOrmModule.forFeature([Payment,PaymentType,Student, PaymentHistory, SppPayment]), ],
  controllers: [PaymentController, PaymentTypeController, PaymentHistoryController],
  providers: [PaymentService, PaymentTypeService, PaymentScheduler, PaymentHistoryService],
})
export class PaymentModule {}
