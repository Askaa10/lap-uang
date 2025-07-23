import { Module } from '@nestjs/common';
import { SchoolFeeService } from './school-fee.service';
import { SchoolFeeController } from './school-fee.controller';

@Module({
  providers: [SchoolFeeService],
  controllers: [SchoolFeeController]
})
export class SchoolFeeModule {}
