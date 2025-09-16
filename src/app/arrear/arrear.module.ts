import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Arrears } from './arrear.entity';
import { ArrearsController } from './arrear.controller';
import { ArrearsService } from './arrear.service';
// import { Arrear } from './arrear.entity';
// import { ArrearService } from './arrear.service';
// import { ArrearController } from './arrear.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Arrears])],
  controllers: [ArrearsController],
  providers: [ArrearsService],
})
export class ArrearModule {}
