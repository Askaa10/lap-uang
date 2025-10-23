// src/app/student/student.service.ts

import { HttpException, Injectable } from '@nestjs/common';
import { BaseResponse } from '../../utils/response/base.response';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { CreateStudentDto } from './student.dto';

@Injectable()
export class StudentService extends BaseResponse {
  constructor(
    @InjectRepository(Student)
    private Sr: Repository<Student>,
  ) {
    super();
  }

  async getAll() {
    const students = await this.Sr.find({ where: { isDelete: false } });
    return this._success({ data: students });
  }

  async createStudents(createStudentDtos: CreateStudentDto[]) {
    try {
      if (createStudentDtos.length === 0) {
        return this._success({ data: [] });
      } else if (createStudentDtos.length > 1) {
        for (let i in createStudentDtos) {
          const createStudentDto = await createStudentDtos[i];
          await this.Sr.save(createStudentDto);
        }
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
      data: student,
      links: {
        self: `/student/create`,
      },
    });
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

  async updateStatusDelete(payload: any, id: string) {
    await this.Sr.update(id, payload);
    const updatedStudent = await this.Sr.findOne({ where: { id } });
    return this._success({ data: updatedStudent });
  }

  async deduplicate(byNIS: boolean = true) {
    const students = await this.Sr.find({ where: { isDelete: false } });
    const seen = new Set();
    const toDelete: string[] = [];

    for (const student of students) {
      const key = byNIS ? student.NIS : student.NISN;
      if (key && seen.has(key)) {
        // duplikat, tandai untuk dihapus
        toDelete.push(student.id);
      } else if (key) {
        seen.add(key);
      }
    }

    // Hapus semua yang duplikat
    if (toDelete.length > 0) {
      await this.Sr.update(toDelete, { isDelete: true });
    }

    return this._success({
      data: {
        deleted: toDelete.length,
        deletedIds: toDelete,
      },
      message:
        toDelete.length > 0
          ? {
              en: 'Duplicates found and deleted',
              id: 'Duplikat ditemukan dan dihapus',
            }
          : { en: 'No duplicates found', id: 'Tidak ada duplikat' },
    });
  }

  async deleteBulkStudent(ids: string[]) {
    const deleted = await this.Sr.delete(ids);
    return this._success({ data: deleted });
  }

  async getSppByMonth(month?: number, year?: number) {
    const m = month ?? new Date().getMonth() + 1; // JS month is 0-based, API expects 1-12
    const y = year ?? new Date().getFullYear();

    // Ambil semua siswa (non deleted) dan join payments yang sesuai month/year
    const students = await this.Sr.createQueryBuilder('student')
      .leftJoinAndSelect(
        'student.payments',
        'payment',
        'payment.month = :month AND payment.year = :year',
        { month: m, year: y },
      )
      .where('student.isDelete = false')
      .getMany();

    // Normalisasi output: total pembayaran pada bulan tsb + daftar pembayaran (bisa kosong)
    const data = students.map((s) => {
      const payments = (s as any).payments ?? [];
      const totalPaid = payments.reduce(
        (sum: number, p: any) => sum + ((p.amountPaid ?? p.amount ?? 0) as number),
        0,
      );
      return {
        id: s.id,
        name: s.name,
        NIS: s.NIS,
        NISN: s.NISN,
        dorm: s.dorm,
        generation: s.generation,
        major: s.major,
        payments,
        totalPaid,
      };
    });

    return this._success({ data, meta: { month: m, year: y } });
  }
}
