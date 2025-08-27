import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SppPaymentService } from './spp-payment.service';
import { CreateSppPaymentDto, UpdateSppPaymentDto } from './spp-payment.dto';

@Controller('spp-payment')
export class SppPaymentController {
  constructor(private readonly sppPaymentService: SppPaymentService) {}

  @Post()
  create(@Body() createDto: CreateSppPaymentDto) {
    return this.sppPaymentService.create(createDto);
  }

  @Get('rekap/:year')
  async getRekap(@Param('year') year: number) {
    return this.sppPaymentService.getSppRekap(year);
  }

  @Get()
  findAll() {
    return this.sppPaymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sppPaymentService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateSppPaymentDto) {
    return this.sppPaymentService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sppPaymentService.remove(id);
  }
}
