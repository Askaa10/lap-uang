import { Module } from '@nestjs/common';
import { FeeGroupService } from './fee-group.service';
import { FeeGroupController } from './fee-group.controller';

@Module({
  providers: [FeeGroupService],
  controllers: [FeeGroupController]
})
export class FeeGroupModule {}
