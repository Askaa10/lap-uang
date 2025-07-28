import { Controller, Get } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
        constructor(private readonly reportService: ReportService) {}
        
        
  @Get('ppus')
  getRekap() {
    return this.reportService.getRekapPembayaran();
  }

  @Get('trpus')
getRekapTagihan() {
  return this.reportService.getRekapTagihan();
}

    
@Get('tpus')
getRekapKekurangan() {
  return this.reportService.getRekapKekurangan();
}

}

