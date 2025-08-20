import { Module } from '@nestjs/common';
import { SppPaymentService } from './spp-payment.service';
import { SppPaymentController } from './spp-payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SppPayment } from './spp-payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SppPayment])],
  providers: [SppPaymentService],
  controllers: [SppPaymentController]
})
export class SppPaymentModule {}
