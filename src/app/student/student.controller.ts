import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto, UpdateStudentDto } from './student.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('all')
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
}
