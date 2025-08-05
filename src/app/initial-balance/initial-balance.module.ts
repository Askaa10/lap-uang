import { Module } from '@nestjs/common';
import { InitialBalanceController } from './initial-balance.controller';
import { InitialBalanceService } from './initial-balance.service';

@Module({
  controllers: [InitialBalanceController],
  providers: [InitialBalanceService]
})
export class InitialBalanceModule {}
