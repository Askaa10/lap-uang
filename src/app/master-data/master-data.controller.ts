import { Controller, Get } from '@nestjs/common';
import { MasterDataService } from './master-data.service';

@Controller('master-data')
export class MasterDataController {
  constructor(private readonly service: MasterDataService) {}

  @Get('all-list')
  async list() {
    return this.service.getMasterData();
  }
}
