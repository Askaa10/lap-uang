import { Module } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { ReceiptsController } from './receipts.controller';

@Module({
  providers: [ReceiptsService],
  controllers: [ReceiptsController]
})
export class ReceiptsModule {}
