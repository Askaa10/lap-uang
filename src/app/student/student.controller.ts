import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto, UpdateStudentDto } from './student.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('')
  async getAllStudents() {
    return this.studentService.getAll();
  }

  @Post('createBulk')
  createStudent(@Body() data: CreateStudentDto[]) {
    return this.studentService.createStudents(data);
  }

  @Post('create')
  async createSingleStudent(@Body() data: CreateStudentDto) {
    return this.studentService.createStudent(data);
  }

  @Put('update/:id')
  updateStudent(@Param('id') id: string, @Body() data: UpdateStudentDto) {
    return this.studentService.updateStudent(id, data);
  }

  @Delete('delete/:id')
  deleteStudent(@Param('id') id: string) {
    return this.studentService.deleteStudent(id);
  }

  @Get("detail/:id")
  detailStudent(@Param('id') id: string, ) {

  }
  @Patch("updateStatusDelete/:id")
  updateStatusDelete(@Body() payload : any, @Param('id') id: string) {
    return this.studentService.updateStatusDelete(payload, id);
  }

  @Get('deduplicate')
  async deduplicateStudent(@Body('byNIS') byNIS: boolean = true) {
    // byNIS: true = cek duplikat berdasarkan NIS, false = cek berdasarkan NISN
    const result = await this.studentService.deduplicate(byNIS);
    return result;
  }

  // GET /student/spp?month=8&year=2025  -> seluruh data siswa dan pembayaran SPP di bulan tersebut
  @Get('spp')
  async getSppByMonth(@Query('month') month?: string, @Query('year') year?: string) {
    const date = new Date();
    const m = month ? parseInt(month, 10) : date.getMonth() + 1;
    const y = year ? parseInt(year, 10) : undefined;
    return this.studentService.getSppByMonth(m, y);
  }

  @Delete('deleteBulkSpp')
  deleteBulkStudent(@Body('ids') ids: string[]) {
    return this.studentService.deleteBulkStudent(ids);
  }
}
