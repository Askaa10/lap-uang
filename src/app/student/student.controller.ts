import { Controller, Get } from '@nestjs/common';
import { StudentService } from './student.service';

@Controller('student')
export class StudentController {
    constructor(private readonly studentService: StudentService) {}

    @Get('getAllStudent')
    async getAllStudents() {
        return this.studentService.getAll();
    }
}
