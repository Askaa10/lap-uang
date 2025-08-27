import { Module } from '@nestjs/common';
import { SppPaymentService } from './spp-payment.service';
import { SppPaymentController } from './spp-payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SppPayment } from './spp-payment.entity';
import { Student } from '../student/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SppPayment, Student])],
  providers: [SppPaymentService],
  controllers: [SppPaymentController]
})
export class SppPaymentModule {}
