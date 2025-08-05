import { Controller, Delete, Get, Post } from '@nestjs/common';
import { InitialBalanceService } from './initial-balance.service';
import { CreateInitialBalanceDto } from './initial-balance.dto';

@Controller('initial-balance')
export class InitialBalanceController {
  constructor(private readonly initialBalanceService: InitialBalanceService) {}

  @Post('create')
  async createInitialBalance(dto: CreateInitialBalanceDto) {
    return this.initialBalanceService.create(dto);
  }

  @Get('GetAll')
  async findAll() {
    return this.initialBalanceService.findAll();
  }

  @Get('GetOne/:id')
  async findOne(id: string) {
    return this.initialBalanceService.findOne(id);
  }

  @Delete('delete/:id')
  async delete(id: string) {
    return this.initialBalanceService.delete(id);
  }
}
