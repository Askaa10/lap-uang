import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseResponse } from 'src/utils/response/base.response';
import { CreateStudentDto } from './student.dto';

@Injectable()
export class StudentService extends BaseResponse {
  constructor(private readonly Ps: PrismaService) {
    super();
  }

  async getAll() {
    const students = await this.Ps.student.findMany();
    return this._success({ data: students });
  }

  async createStudents(createStudentDtos: CreateStudentDto[]) {
    const students = await this.Ps.student.createMany({
      data: createStudentDtos.map((dto) => ({
        ...dto,
        sppTariff: 0, // default manual karena tidak ada di DTO
      })),
    });
    return this._success({ data: students });
  }

  async updateStudent(id: string, updateData: Partial<CreateStudentDto>) {
    const updatedStudent = await this.Ps.student.update({
      where: { id },
      data: updateData,
    });
    return this._success({ data: updatedStudent });
  }

  async deleteStudent(id : string){
    const deletedStudent = await this.Ps.student.delete({
      where: { id },
    });
    return this._success({ data: deletedStudent });
  }
}
