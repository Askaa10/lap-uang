import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentType } from './payment-type.entity';
import { PaymentTypeService } from './payment-type.service';
import { PaymentTypeController } from './payment-type.controller';
import { Student } from 'src/app/student/student.entity';
import { Payment } from '../payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentType, Student, Payment]),
  ],
  controllers: [PaymentTypeController],
  providers: [PaymentTypeService],
  exports: [PaymentTypeService, TypeOrmModule],
})
export class PaymentTypeModule {}
