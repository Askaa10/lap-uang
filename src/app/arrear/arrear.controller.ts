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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.arrearsService.findOne(id);
  }

  // ✅ Update data berdasarkan ID
  @Put('update/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<ArrearsDto>) {
    return this.arrearsService.update(id, dto);
  }

  // ✅ Hapus satu data
  @Delete('hapus/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.arrearsService.remove(id);
  }

  // ✅ Hapus banyak data sekaligus
  @Delete('hapus-banyak')
  removeBulk(@Body('ids') ids: number[]) {
    return this.arrearsService.removeBulk(ids);
  }
}
