import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, UpdatePaymentDto } from './payment.dto';
import { PaymentTypeService } from './payment-type/payment-type.service';
@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly paymentTypeService: PaymentTypeService,
  ) {}

  @Post('tambah')
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentService.create(dto);
  }

  @Get('semua')
  findAll() {
    return this.paymentService.findAll();
  }

  @Get('detail/:id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdatePaymentDto) {
    return this.paymentService.update(id, dto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(id);
  }
}
