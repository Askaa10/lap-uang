// spp-payment.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
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
   
    const students = await this.studentRepo.find({
      where: { isDelete: false },
    });
  
    // Ambil semua pembayaran SPP tahun tertentu
    const payments = await this.sppPaymentRepository.find({
      where: { year: Between(yearBefore, yearNext) },
      relations: ['student'],
    });
  
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
  
    const result = students.map((student) => {
      const studentPayments = payments.filter(
        (p) => p.studentId === student.id,
      );
  
      const monthData = {};
      for (const m of months) {
        const payment = studentPayments.find((p) => p.month === m);
        monthData[m.toLowerCase()] = payment ? payment.status : 'BELUM_BAYAR';
      }
  
      return {
        nama: student.name,
        generation: student.generation, // ⬅️ DITAMBAHKAN DI SINI
        ...monthData,
      };
    });
  
    return this._success({
      data: result,
      included: ['student', 'spp-payment'],
    });
  }

  async generateSppForStudent(studentId: string, year: string, nominal: number) {
    const student = await this.studentRepo.findOneBy({ id: studentId });
    if (!student) throw new NotFoundException('Student not found');
  
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
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
    const students = await this.studentRepo.find({ where: { isDelete: false } });
  
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
  

  async getByStudentId(studentID:string, year:string) {
    const result = await this.studentRepo.findOne({
      where: { id: studentID, spp: {year: year} },
      relations: ['spp']
    });

    return this._success({data:result})
  }

  async create(dto: CreateSppPaymentDto) {
    const payment = this.sppPaymentRepository.create(dto);
    await this.sppPaymentRepository.save(payment);
    return this._success({ data: payment });
  }

  async findAll() {
    const payments = await this.sppPaymentRepository.find({
      relations: ["student"],
    });
    return this._success({ data: payments, included: ["student"] });
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
