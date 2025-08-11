import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Arrear } from './arrear.entity';
import { ArrearService } from './arrear.service';
import { ArrearController } from './arrear.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Arrear } from './arrear.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Arrear])],
  controllers: [ArrearController],
  providers: [ArrearService],
})
export class ArrearModule {}
