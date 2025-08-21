// src/app/student/student.service.ts

import { HttpException, Injectable } from '@nestjs/common';
import { BaseResponse } from 'src/utils/response/base.response';
import { CreateStudentDto } from './student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';

@Injectable()
export class StudentService extends BaseResponse {
  constructor(
    @InjectRepository(Student)
    private Sr: Repository<Student>,
  ) {
    super();
  }

  async getAll() {
    const students = await this.Sr.find();
    return this._success({ data: students });
  }

  async createStudents(createStudentDtos: CreateStudentDto[]) {
    if(createStudentDtos.length === 0) {
      return this._success({ data: [] });
    } else if(createStudentDtos.length > 1) {
      for (let i in createStudentDtos) {
        const createStudentDto =  await createStudentDtos[i];
        await this.Sr.save(createStudentDto);
      }
      return this._success({
        data: createStudentDtos,
        links: {
          self: '/student/createBulk',
        },
      });
    } catch (err) {
      if (err) {
        throw new HttpException(`Error creating students: ${err.message}`, 500);
      }
  }
  }

  async createStudent(createStudentDto: CreateStudentDto) {
    const student = this.Sr.create(createStudentDto);
    await this.Sr.save(student);
    return this._success({
      data: student, links: {
      self: `/student/create`
    } });
  }

  async updateStudent(id: string, updateData: Partial<CreateStudentDto> | any) {
    await this.Sr.update(id, updateData);
    const updatedStudent = await this.Sr.findOne({ where: { id } });
    return this._success({ data: updatedStudent });
  }

  async deleteStudent(id: string) {
    const deleted = await this.Sr.delete(id);
    return this._success({ data: deleted });
  }

  async detailStudent(id: string) {
    const student = await this.Sr.findOne({ where: { id } });
    return this._success({ data: student });
  }
}

