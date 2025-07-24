import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { SchoolFeeService } from './school-fee.service';
import { CreateSchoolFeeItemDto, UpdateSchoolFeeItemDto } from './school-fee.dto';


@Controller('school-fee')
export class SchoolFeeController {
  constructor(private readonly service: SchoolFeeService) {}

  @Post()
  async create(@Body() dto: CreateSchoolFeeItemDto) {
    return await this.service.create(dto);
  }

  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.service.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSchoolFeeItemDto) {
    return await this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(id);
  }

  @Post('create-bulk-fe')
  async createBulk(@Body() dto: CreateSchoolFeeItemDto[]) {
    return await this.service.createBulkFe(dto);
  }
}