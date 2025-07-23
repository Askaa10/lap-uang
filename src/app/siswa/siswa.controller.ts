import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
  } from '@nestjs/common';

import { CreateStudentDto, UpdateStudentDto } from './siswa.dto';
import { SiswaService } from './siswa.service';
  
  @Controller('students')
  export class SiswaController {
    constructor(private readonly siswaService: SiswaService) {}
  
    @Post('tambah-siswa')
    create(@Body() dto: CreateStudentDto) {
      return this.siswaService.create(dto);
    }
  
    @Get('daftar-siswa')
    findAll() {
      return this.siswaService.findAll();
    }
  
    @Get('detail/:id')
    findOne(@Param('id') id: string) {
      return this.siswaService.findOne(id);
    }
  
    @Put('update/:id')
    update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
      return this.siswaService.update(id, dto);
    }
  
    @Delete('hapus/:id')
    remove(@Param('id') id: string) {
      return this.siswaService.remove(id);
    }
  }
  