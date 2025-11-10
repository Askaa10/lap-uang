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
  @Post('/bayar/:id/:NISN')
  async bayarTunggakan(@Param("NISN") NISN: string, @Param("id") id:string) {
    return this.arrearsService.PayArrers(NISN, id)
  }
  
  @Get('student/:NISN')
  async getByStudent(@Param('NISN') NISN: string) {
    return this.arrearsService.getArrearsByStudent(NISN);
  }
}
