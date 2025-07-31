import { Module } from '@nestjs/common';
import { ArrearService } from './arrear.service';
import { ArrearController } from './arrear.controller';

@Module({
  providers: [ArrearService],
  controllers: [ArrearController]
})
export class ArrearModule {}
