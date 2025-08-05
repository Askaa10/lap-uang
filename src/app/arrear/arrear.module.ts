import { Module } from '@nestjs/common';
import { ArrearService } from './arrear.service';
import { ArrearController } from './arrear.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Arrear } from './arrear.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Arrear])],
  providers: [ArrearService],
  controllers: [ArrearController]
})
export class ArrearModule {}
