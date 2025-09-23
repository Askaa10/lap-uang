import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Arrears } from './arrear.entity';
import { ArrearsController } from './arrear.controller';
import { ArrearsService } from './arrear.service';
import { Payment } from '../payment/payment.entity';
// import { ScheduleModule } from '@nestjs/schedule';



@Module({
  imports: [
    TypeOrmModule.forFeature([Arrears, Payment]),
  ],
  controllers: [ArrearsController],
  providers: [ArrearsService],
})
export class ArrearModule {}
