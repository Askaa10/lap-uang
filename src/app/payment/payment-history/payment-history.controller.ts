import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
  } from '@nestjs/common';
  import { PaymentHistoryService } from './payment-history.service';
  import { CreatePaymentHistoryDto, UpdatePaymentHistoryDto } from './payment-history.dto';
import { CreatePaymentDto } from '../payment.dto';
  
  @Controller('payment-history')
  export class PaymentHistoryController {
    constructor(private readonly service: PaymentHistoryService) {}
  
    @Post('tambah')
    create(@Body() dto: CreatePaymentHistoryDto) {
      return this.service.create(dto);
    }
  
    @Get()
    findAll() {
      return this.service.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.service.findOne(id);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdatePaymentHistoryDto) {
      return this.service.update(id, dto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.service.remove(id);
    }
  }
  