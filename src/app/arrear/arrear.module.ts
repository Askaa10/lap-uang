import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Arrears } from './arrear.entity';
import { ArrearsController } from './arrear.controller';
import { ArrearsService } from './arrear.service';
import { Payment } from '../payment/payment.entity';
import { StudentModule } from '../student/student.module';
import { Student } from '../student/student.entity';
import { PaymentType } from '../payment/payment-type/payment-type.entity';
// import { ScheduleModule } from '@nestjs/schedule';



@Module({
  imports: [
    TypeOrmModule.forFeature([Arrears, Payment,Student, PaymentType])  ,
    StudentModule 
  ],
  controllers: [ArrearsController],
  providers: [ArrearsService],
})
export class ArrearModule {}
