import { Module } from '@nestjs/common';
import { InitialBalanceController } from './initial-balance.controller';
import { InitialBalanceService } from './initial-balance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InitialBalance } from './initial-balance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InitialBalance])],
  controllers: [InitialBalanceController],
  providers: [InitialBalanceService]
})
export class InitialBalanceModule {}
