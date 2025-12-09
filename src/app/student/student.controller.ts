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

  // CREATE student + auto generate 36 bulan payment SPP
  @Post('create')
  async create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Post('createBulk')
  async createMany(@Body() createStudentDtos: CreateStudentDto[]) {
    return this.studentService.createMany(createStudentDtos);
  }

  @Patch('/updateStatusDelete/:id')
  async updateIsDeleteStudent(@Param('id') id: string) {
    return await this.studentService.DeleteStudentStatus(id);
  }
  @Get()
  async findAll() {
    return this.studentService.findAll();
  }


  @Patch('/update/:id')
  async updateStudent(@Param('id') id: string, @Body() payload: UpdateStudentDto) {
    return await this.studentService.updateStudent(id, payload);
    }

  // GET student berdasarkan id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  // DELETE student berdasarkan id
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }
}
