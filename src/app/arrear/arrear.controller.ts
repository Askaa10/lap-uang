// src/arrears/arrears.controller.ts
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { ArrearsService } from './arrear.service';
import { ArrearsDto } from './arrear.dto';


@Controller('arrears')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class ArrearsController {
  constructor(private readonly arrearsService: ArrearsService) {}

  // ✅ Tambah satu arrear
  @Post('tambah')
  create(@Body() dto: ArrearsDto) {
    return this.arrearsService.create(dto);
  }

  // ✅ Tambah banyak arrears
  @Post('tambah-banyak')
  createBulk(@Body() dtos: ArrearsDto[]) {
    return this.arrearsService.createBulk(dtos);
  }

  // ✅ Ambil semua data arrears
  @Get('semua')
  findAll() {
    return this.arrearsService.findAll();
  }

  // ✅ Ambil data berdasarkan ID
  @Get('detail/:id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.arrearsService.findOne(id);
  }

  // ✅ Update data berdasarkan ID
  @Put('update/:id')
  update(@Param('id', ParseIntPipe) id: string, @Body() dto: Partial<ArrearsDto>) {
    return this.arrearsService.update(id, dto);
  }

  // ✅ Hapus satu data
  @Delete('hapus/:id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.arrearsService.remove(id);
  }

  // ✅ Hapus banyak data sekaligus
  @Delete('hapus-banyak')
  removeBulk(@Body('ids') ids: number[]) {
    return this.arrearsService.removeBulk(ids);
  }

  // GET /arrears/unpaid?month=8&year=2025
  @Get('unpaid')
  async getStudentsWithArrears(@Query('month') month?: string, @Query('year') year?: string) {
    const m = month ? parseInt(month, 10) : undefined;
    const y = year ? parseInt(year, 10) : undefined;
    return this.arrearsService.getStudentsWithArrears(m, y);
  }

  // GET /arrears/unpaid/student/:id?year=2025
  @Get('unpaid/student/:id')
  async getStudentUnpaidMonths(
    @Param('id') id: string,
    @Query('year') year?: string,
  ) {
    const y = year ? parseInt(year, 10) : undefined;
    return this.arrearsService.getStudentUnpaidMonths(id, y);
  }


  // POST /arrears/:id/pay
  @Post(':id/pay')
  async paySppByStudentId(
    @Param('id') id: string,
    @Body()
    body: {
      amount: number;
      year?: number;
      month?: number; // optional - jika disediakan bayar khusus bulan ini, jika tidak alokasi ke bulan terawal yg belum lunas
      note?: string;
    },
  ) {
    const year = body.year ?? new Date().getFullYear();
    return this.arrearsService.paySppByStudentId({
      studentId: id,
      amount: body.amount,
      year,
      month: body.month,
      note: body.note,
    });
  }
}
