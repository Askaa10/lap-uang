import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { SppPaymentService } from './spp-payment.service';
import { CreateSppPaymentDto, UpdateSppPaymentDto } from './spp-payment.dto';

@Controller('spp-payment')
export class SppPaymentController {
  constructor(private readonly sppPaymentService: SppPaymentService) {}

  @Post('tambah')
  create(@Body() createDto: CreateSppPaymentDto) {
    return this.sppPaymentService.create(createDto);
  }

  @Get('rekap/:yearBefore/:yearNext')
  async getRekap(@Param('yearBefore') yearBefore: string, @Param('yearNext') yearNext: string) {
    return this.sppPaymentService.getSppRekap(yearBefore, yearNext);
  }

  @Get('semua')

  findAll() {
    return this.sppPaymentService.findAll();

   }
  
  @Get("student/:id/:yearBefore/:yearNext")
  getByStudentId(@Param('id') studentID: string , @Param('yearBefore') yearBefore: string, @Param('yearNext') yearNext: string) {
    return this.sppPaymentService.getByStudentId(studentID, `${yearBefore}/${yearNext}`);
  }

  @Get('detail/:id')
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
