import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { PaymentHistoryService } from './payment-history.service';
import { CreatePaymentHistoryDto, UpdatePaymentHistoryDto } from './payment-history.dto';


@Controller('payment-history')
export class PaymentHistoryController {
  constructor(private readonly service: PaymentHistoryService) {}

  @Post()
  create(@Body() dto: CreatePaymentHistoryDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':paymentId')
  findByPayment(@Param('paymentId') paymentId: string) {
    return this.service.findByPayment(paymentId);
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