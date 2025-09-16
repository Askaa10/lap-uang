import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Arrears } from './arrear.entity';
import { ArrearsController } from './arrear.controller';
import { ArrearsService } from './arrear.service';



@Module({
  imports: [TypeOrmModule.forFeature([Arrears])],
  controllers: [ArrearsController],
  providers: [ArrearsService],
})
export class ArrearModule {}
