// spp-payment.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { SppPayment } from './spp-payment.entity';
import { BaseResponse } from '../../utils/response/base.response';
import { CreateSppPaymentDto, UpdateSppPaymentDto } from './spp-payment.dto';
import { Student } from '../student/student.entity';

@Injectable()
export class SppPaymentService extends BaseResponse {
  constructor(
    @InjectRepository(SppPayment)
    private readonly sppPaymentRepository: Repository<SppPayment>,
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
  ) {
    super();
  }

  async getSppRekap(yearBefore: string, yearNext: string) {
    // ambil semua siswa aktif
    const students = await this.studentRepo.find({
      where: { isDelete: false },
    });

    if (!students.length) {
      return this._success({
        data: [],
        included: ['student', 'spp-payment'],
      });
    }

    const studentIds = students.map((s) => s.id);

    // ambil semua pembayaran SPP dalam rentang tahun itu, hanya untuk siswa yang ada
    const payments = await this.sppPaymentRepository.find({
      where: {
        studentId: In(studentIds),
        year: Between(yearBefore, yearNext),
      },
    });

    // bikin index biar lookup cepat: "studentId-month-year" -> payment
    const paymentIndex = new Map<string, SppPayment>();
    for (const p of payments) {
      const key = `${p.studentId}-${p.month}-${p.year}`;
      paymentIndex.set(key, p);
    }

    // bulan pakai pola tahun ajaran: Juli–Des (yearBefore), Jan–Jun (yearNext)
    const monthYearPairs = [
      { month: 'Juli', year: yearBefore },
      { month: 'Agustus', year: yearBefore },
      { month: 'September', year: yearBefore },
      { month: 'Oktober', year: yearBefore },
      { month: 'November', year: yearBefore },
      { month: 'Desember', year: yearBefore },
      { month: 'Januari', year: yearNext },
      { month: 'Februari', year: yearNext },
      { month: 'Maret', year: yearNext },
      { month: 'April', year: yearNext },
      { month: 'Mei', year: yearNext },
      { month: 'Juni', year: yearNext },
    ];

    const result = students.map((student) => {
      const monthData: Record<string, string> = {};

      for (const { month, year } of monthYearPairs) {
        const key = `${student.id}-${month}-${year}`;
        const payment = paymentIndex.get(key);

        // kalau ada data → pakai status asli
        // kalau tidak ada → default BELUM_LUNAS
        monthData[month.toLowerCase()] = payment?.status ?? 'BELUM_LUNAS';
      }

      return {
        id: student.id,
        nama: student.name,
        InductNumber: student.InductNumber,
        tipeProgram: student.tipeProgram,
        dorm: student.dorm,
        generation: student.generation,
        ...monthData,
      };
    });

    return this._success({
      data: result,
      included: ['student', 'spp-payment'],
    });
  }

  async createBulk(dtos: CreateSppPaymentDto[]) {
    const results = [];

    for (const dto of dtos) {
      // Cek apakah sudah ada supaya tidak duplicate
      const exists = await this.sppPaymentRepository.findOne({
        where: {
          studentId: dto.studentId,
          month: dto.month,
          year: dto.year,
        },
      });

      if (exists) {
        results.push({
          ...exists,
          note: 'Sudah ada (skip)',
        });
        continue;
      }

      const payment = this.sppPaymentRepository.create(dto);
      const saved = await this.sppPaymentRepository.save(payment);

      results.push({
        ...saved,
        note: 'Berhasil dibuat',
      });
    }

    return this._success({
      message: {
        en: 'Bulk SPP created successfully',
        id: 'SPP bulk berhasil dibuat',
      },
      data: results,
    });
  }

  async generateSppForStudent(
    studentId: string,
    year: string,
    nominal: number,
  ) {
    const student = await this.studentRepo.findOneBy({ id: studentId });
    if (!student) throw new NotFoundException('Student not found');

    const months = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];

    // Cek apakah SPP tahun tersebut sudah ada
    const existing = await this.sppPaymentRepository.find({
      where: { studentId, year },
    });

    if (existing.length > 0) {
      throw new Error(`SPP ${year} untuk siswa ini sudah pernah digenerate`);
    }

    const list = months.map((month) =>
      this.sppPaymentRepository.create({
        studentId,
        month,
        year,
        nominal,
        remainder: nominal,
        paid: 0,
        status: 'BELUM_LUNAS',
      }),
    );

    await this.sppPaymentRepository.save(list);

    return this._success({
      message: {
        en: `SPP ${year} successfully generated for all students`,
        id: `SPP ${year} berhasil dibuat untuk semua siswa`,
      },
      data: list,
    });
  }

  async generateSppForAllStudents(year: string, nominal: number) {
    const students = await this.studentRepo.find({
      where: { isDelete: false },
    });

    for (const student of students) {
      await this.generateSppForStudent(student.id, year, nominal);
    }

    return this._success({
      message: {
        en: `SPP ${year} successfully generated for all students`,
        id: `SPP ${year} berhasil dibuat untuk semua siswa`,
      },
    });
  }

  async getByStudentId(studentID: string, year: string) {
    const result = await this.studentRepo.findOne({
      where: { id: studentID, spp: { year: year } },
      relations: ['spp'],
    });

    return this._success({ data: result });
  }

  async create(dto: CreateSppPaymentDto) {
    // pastikan nominal dalam bentuk number
    const nominal = Number(dto.nominal) || 0;

    const payment = this.sppPaymentRepository.create({
      ...dto,
      nominal,
      paid: nominal, // langsung set paid di sini
      remainder: 0, // karena paid = nominal, sisa = 0
    });

    await this.sppPaymentRepository.save(payment);

    return this._success({ data: payment });
  }

  async findAll() {
    const payments = await this.sppPaymentRepository.find({
      relations: ['student'],
    });
    return this._success({ data: payments, included: ['student'] });
  }

  async findOne(id: string) {
    const payment = await this.sppPaymentRepository.findOneBy({ id });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return this._success({ data: payment });
  }

  async update(id: string, dto: UpdateSppPaymentDto) {
    await this.sppPaymentRepository.update(id, dto);
    const updated = await this.sppPaymentRepository.findOneBy({ id });
    return this._success({ data: updated });
  }

  async remove(id: string) {
    const result = await this.sppPaymentRepository.delete(id);
    return this._success({ data: { affected: result.affected } });
  }
}
