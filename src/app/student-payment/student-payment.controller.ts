import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { StudentPaymentService } from './student-payment.service';
import { CreateStudentPaymentDto, UpdateStudentPaymentDto } from './student-payment.dto';

@Controller('student-payments')
export class StudentPaymentController {
  constructor(private readonly service: StudentPaymentService) {}

  @Post()
  async create(@Body() dto: CreateStudentPaymentDto) {
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
  async update(@Param('id') id: string, @Body() dto: UpdateStudentPaymentDto) {
    return await this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(id);
  }
}
