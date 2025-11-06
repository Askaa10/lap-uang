import { Controller, Get, Post, Param } from '@nestjs/common';
import { ArrearsService } from './arrear.service';

@Controller('arrears')
export class ArrearsController {
  constructor(private readonly arrearsService: ArrearsService) {}

  @Post('generate')
  async generateArrears() {
    return this.arrearsService.createMonthlyArrearsForAllStudents();
  }

  @Get()
  async getAll() {
    return this.arrearsService.getAllArrears();
  }

  @Get('student/:id')
  async getByStudent(@Param('id') studentId: string) {
    return this.arrearsService.getArrearsByStudent(studentId);
  }
}
