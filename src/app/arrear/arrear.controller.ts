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
} from '@nestjs/common';
import { ArrearsService } from './arrear.service';
import { ArrearsDto } from './arrear.dto';

@Controller('arrears')
export class ArrearsController {
  constructor(private readonly arrearsService: ArrearsService) {}

  // ✅ Create single arrear
  @Post()
  create(@Body() dto: ArrearsDto) {
    return this.arrearsService.create(dto);
  }

  // ✅ Create bulk arrears
  @Post('bulk')
  createBulk(@Body() dtos: ArrearsDto[]) {
    return this.arrearsService.createBulk(dtos);
  }

  // ✅ Get all arrears
  @Get()
  findAll() {
    return this.arrearsService.findAll();
  }

  // ✅ Get arrear by ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.arrearsService.findOne(id);
  }

  // ✅ Update arrear by ID
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<ArrearsDto>) {
    return this.arrearsService.update(id, dto);
  }

  // ✅ Delete arrear by ID
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.arrearsService.remove(id);
  }

  // ✅ Delete bulk arrears
  @Delete()
  removeBulk(@Body('ids') ids: number[]) {
    return this.arrearsService.removeBulk(ids);
  }
}
