import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { CreatePaymentTypeDto, UpdatePaymentTypeDto } from './payment-type.dto';
import { PaymentTypeService } from './payment-type.service';

@Controller('payment-types')
export class PaymentTypeController {
  constructor(private readonly service: PaymentTypeService) {}

  @Post('create')
  create(@Body() dto: CreatePaymentTypeDto) {
    return this.service.create(dto);
  }

  @Get('all')
  findAll() {
    return this.service.findAll();
  }

  @Get('with-status')
  findAllWithStatus() {
    return this.service.findAllWithPaymentStatus();
  }

  @Get('detail/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdatePaymentTypeDto) {
    return this.service.update(id, dto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
