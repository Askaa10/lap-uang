import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto, UpdateStudentDto } from './student.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('getAllStudent')
  async getAllStudents() {
    return this.studentService.getAll();
  }

  @Post('createBulk')
  createStudent(@Body() data: CreateStudentDto[]) {
    return this.studentService.createStudents(data);
  }

  @Post('createStudent')
  createSingleStudent(@Body() data: CreateStudentDto) {
    return this.studentService.createStudent(data);
  }

    @Post('updateStudent/:id')
  updateStudent(@Param('id') id: string, @Body() data: UpdateStudentDto) {
    return this.studentService.updateStudent(id, data);
  }

  @Delete('deleteStudent/:id')
  deleteStudent(@Param('id') id: string) {
    return this.studentService.deleteStudent(id);
  }
}
