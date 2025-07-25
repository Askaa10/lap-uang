import { SchoolService } from './school.service';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateSchoolDto } from './school.dto';

@Controller('school')
export class SchoolController {
  constructor(private SchoolService: SchoolService) {}

  @Get('all-school')
  async getAllSchool() {
    return this.SchoolService.allSchool();
  }

  @Post('create-data-school')
  async createDataSchool(@Body() data: CreateSchoolDto) {
    return this.SchoolService.createDataSchool(data);
  }

  @Post('update-data-school/:id')
  async updateDataSchool(
    @Body() data: CreateSchoolDto,
    @Param('id') id: string,
  ) {
    return this.SchoolService.updateDataSchool(id, data);
  }

  @Delete('delete-data-school/:id')
  async deleteDataSchool(@Param('id') id: string) {
    return this.SchoolService.deleteDataSchool(id);
  }
}
