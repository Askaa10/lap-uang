import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PaymentType } from './payment-type.entity';
import { CreatePaymentTypeDto, UpdatePaymentTypeDto } from './payment-type.dto';
import { BaseResponse } from '../../../utils/response/base.response';
import { Student } from '../../student/student.entity';
import { Payment, PaymentStatus } from '../payment.entity';
import { CategoryTypes } from './payment-type.enum';

@Injectable()
export class PaymentTypeService extends BaseResponse {
  constructor(
    @InjectRepository(PaymentType)
    private readonly repo: Repository<PaymentType>,

    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,

    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {
    super();
  }

  // ==========================================================
  //    ⛳  AUTO GENERATE PAYMENT
  // ==========================================================
  private async generatePayments(paymentType: PaymentType, students: Student[]) {
    const payments = students.map((student) => {
  
      // Cek tipe payment type
      const initialStatus =
        paymentType.type === CategoryTypes.INSTALLMENT
          ? PaymentStatus.NYICIL     // <--- kalau instalment, status nyicil
          : PaymentStatus.BELUM_LUNAS;
  
      return this.paymentRepo.create({
        studentId: student.id,
        student,
        type: paymentType,
        amount: paymentType.nominal,
        status: initialStatus,         // <--- pakai status otomatis
        paid: 0,
        remainder: paymentType.nominal,
  
        // opsional (jika kamu mau)
        date: new Date(),
        method: 'NORMAL',
        
      } as Partial<Payment>);
    });
  
    await this.paymentRepo.save(payments);
  
    console.log(`✅ Generated ${payments.length} payments`);
  }

  // ==========================================================
  //    CREATE PAYMENT TYPE
  // ==========================================================
  async create(dto: CreatePaymentTypeDto) {
    let students = [];

    console.log('👉 studentIds dari FE:', dto.studentIds);

    if (Array.isArray(dto.studentIds) && dto.studentIds.length > 0) {
      students = await this.studentRepo.findBy({
        id: In(dto.studentIds),
      });

      if (students.length === 0) {
        throw new NotFoundException('Siswa tidak ditemukan untuk ID yang dikirim');
      }
    } else {
      console.log('⚠️ Tidak ada studentIds dikirim — otomatis ambil semua siswa');
      students = await this.studentRepo.find();
    }

    const paymentType = this.repo.create({
      ...dto,
      students,
    });

    const saved = await this.repo.save(paymentType);

    // =======================================================
    //   ⛳ AUTO GENERATE PAYMENT UNTUK SEMUA SISWA
    // =======================================================
    await this.generatePayments(saved, students);

    return {
      success: true,
      message: {
        id: `Payment type berhasil dibuat untuk ${students.length} siswa`,
        en: `Payment type created for ${students.length} students`,
      },
      data: saved,
    };
  }

  // ==========================================================
  //   FIND ALL WITH STATUS
  // ==========================================================
  async findAllWithPaymentStatus() {
    const result = await this.repo.find({
      relations: ['students', 'payments', 'payments.student'],
    });

    const finalData = result.map((pt) => {
      const payments = pt.payments || [];

      const studentsWithStatus = pt.students.map((student) => {
        const payment = payments.find(
          (p) => p.student && p.student.id === student.id
        );

        const status = payment?.status || 'Belum_lunas';

        return { ...student, status };
      });

      return {
        ...pt,
        type: pt.type,
        students: studentsWithStatus,
      };
    });

    return this._success({
      auth: null,
      data: finalData,
      errors: null,
      links: { self: '/payment-types/with-status' },
      included: null,
      message: {
        id: 'Data berhasil diambil',
        en: 'Data fetched successfully',
      },
    });
  }

  // ==========================================================
  //   FIND ALL
  // ==========================================================
  async findAll() {
    const types = await this.repo.find({ relations: ['students'] });
    return this._success({
      auth: null,
      data: types,
      errors: null,
      links: { self: '/payment-types/all' },
      included: null,
      message: {
        id: 'Data berhasil diambil',
        en: 'Data fetched successfully',
      },
    });
  }

  // ==========================================================
  //   FIND ONE
  // ==========================================================
  async findOne(id: string) {
    const found = await this.repo.findOne({
      where: { id },
      relations: ['students'],
    });
    if (!found) throw new NotFoundException('Payment type not found');

    return this._success({
      auth: null,
      data: found,
      errors: null,
      links: { self: `/payment-types/detail/${id}` },
      included: null,
      message: {
        id: 'Data ditemukan',
        en: 'Data found',
      },
    });
  }

  // ==========================================================
  //   UPDATE PAYMENT TYPE
  // ==========================================================
  async update(id: string, dto: UpdatePaymentTypeDto) {
    const existing = await this.repo.findOne({
      where: { id },
      relations: ['students'],
    });

    if (!existing) throw new NotFoundException('Payment type not found');

    Object.assign(existing, dto);

    let students = [];

    if (Array.isArray(dto.studentIds) && dto.studentIds.length > 0) {
      students = await this.studentRepo.findBy({
        id: In(dto.studentIds),
      });

      if (students.length === 0) {
        throw new NotFoundException('Siswa tidak ditemukan untuk ID yang dikirim');
      }
    } else {
      students = await this.studentRepo.find({
        where: { isDelete: false },
      });
    }

    existing.students = students;

    const saved = await this.repo.save(existing);

    return this._success({
      data: saved,
      message: {
        id: `Payment type berhasil diperbarui untuk ${students.length} siswa`,
        en: `Payment type updated for ${students.length} students`,
      },
    });
  }

  // ==========================================================
  //   DELETE
  // ==========================================================
  async remove(id: string) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Payment type not found');

    await this.repo.remove(found);
    return this._success({
      auth: null,
      data: found,
      errors: null,
      links: { self: `/payment-types/delete/${id}` },
      included: null,
      message: {
        id: 'Data berhasil dihapus',
        en: 'Data deleted successfully',
      },
    });
  }
}
