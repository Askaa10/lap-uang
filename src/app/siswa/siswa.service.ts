import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto, UpdateStudentDto } from './siswa.dto';
import { BaseResponse } from 'src/utils/response/base.response';


@Injectable()
export class SiswaService extends BaseResponse {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: CreateStudentDto) {
    const student = await this.prisma.student.create({ data });

    return this._success({
      message: {
        id: 'Siswa berhasil ditambahkan',
        en: 'Student created successfully',
      },
      data: student,
      auth: null,
      links: {
        self: '/students/tambah-siswa',
      },
      statusCode: 201,
      statusText: 'Created',
    });
  }

  async findAll() {
    const students = await this.prisma.student.findMany({
      include: { school: true, payments: true },
    });

    return this._success({
      message: {
        id: 'Berhasil mengambil semua siswa',
        en: 'Students fetched successfully',
      },
      data: students,
      auth: null,
      links: {
        self: '/students/daftar-siswa',
      },
    });
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: { school: true, payments: true },
    });

    if (!student) throw new NotFoundException('Siswa tidak ditemukan');

    return this._success({
      message: {
        id: 'Siswa ditemukan',
        en: 'Student found',
      },
      data: student,
      auth: null,
      links: {
        self: `/students/detail/${id}`,
      },
    });
  }

  async update(id: string, data: UpdateStudentDto) {
    const exists = await this.prisma.student.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Siswa tidak ditemukan');

    const updated = await this.prisma.student.update({
      where: { id },
      data,
    });

    return this._success({
      message: {
        id: 'Siswa berhasil diperbarui',
        en: 'Student updated successfully',
      },
      data: updated,
      auth: null,
      links: {
        self: `/students/update/${id}`,
      },
    });
  }

  async remove(id: string) {
    const exists = await this.prisma.student.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Siswa tidak ditemukan');

    const deleted = await this.prisma.student.delete({ where: { id } });

    return this._success({
      message: {
        id: 'Siswa berhasil dihapus',
        en: 'Student deleted successfully',
      },
      data: deleted,
      auth: null,
      links: {
        self: `/students/hapus/${id}`,
      },
    });
  }


  async createBulk(payload : CreateStudentDto[]) {
    const students = await this.prisma.student.createMany({ data: payload });

    return this._success({
      message: {
        id: 'Siswa berhasil ditambahkan',
        en: 'Student created successfully',
      },
      data: students,
      auth: null,
      links: {
        self: '/students/tambah-siswa',
      },
      statusCode: 201,
      statusText: 'Created',
    });
  }
}
