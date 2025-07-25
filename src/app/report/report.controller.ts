import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateSppPaymentDto, ReportQueryDto } from './report-query.dto';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('spp')
  async getSppReport(@Query() query: ReportQueryDto) {
    return this.reportService.getSppReport(query);
  }

  @Get('lainnya')
  async getOtherPayments() {
    return this.reportService.getOtherPayments();
  }

  @Get('tunggakan')
  async getTunggakanReport() {
    return this.reportService.getTunggakanReport();
  }
}
