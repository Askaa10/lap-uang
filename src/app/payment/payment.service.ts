import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Payment, PaymentStatus } from './payment.entity';

import { PaymentType } from './payment-type/payment-type.entity';
import { CreatePaymentDto, UpdatePaymentDto } from './payment.dto';
import { BaseResponse } from 'src/utils/response/base.response';
import { Student } from '../student/student.entity';
import { snakeCase } from 'lodash';

@Injectable()
export class PaymentService extends BaseResponse {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,

    @InjectRepository(PaymentType)
    private readonly paymentTypeRepo: Repository<PaymentType>,
  ) {
    super();
  }

  async create(dto: CreatePaymentDto) {
    const payment = this.paymentRepo.create({
      ...dto,
      status: PaymentStatus.LUNAS,
    });
    const saved = await this.paymentRepo.save(payment);
    return {
      message: 'Payment created successfully',
      data: saved,
    };
  }

  async createBulk(dtos: CreatePaymentDto[]) {
    const payments = this.paymentRepo.create(dtos);
    const saved = await this.paymentRepo.save(payments);
    return {
      message: 'Payments created successfully',
      data: saved,
    };
  }

  async findAll() {
    const payments = await this.paymentRepo.find({ relations: ['student'] });
    return {
      message: 'List of all payments',
      total: payments.length,
      data: payments,
    };
  }

  async getGroupedPaymentsByStudent(typeId: string) {
    const payments = await this.paymentRepo.find({
      where: { typeId },
      relations: ['student', 'type'], // ambil student + payment type
      order: { date: 'ASC' },
    });

    const grouped = payments.reduce(
      (acc, curr) => {
        const key = curr.studentId;

        if (!acc[key]) {
          acc[key] = {
            studentId: curr.studentId,
            nama: curr.student?.name ?? 'Unknown',
            tipeKategori: curr.type?.name ?? 'Unknown',
            jumlahPembayaran: curr.amount,
            jumlahTransaksi: 1,
            jumlahTagihan: curr.type?.nominal ?? 0, // 🔥 ambil dari PaymentType
            jumlahHarusDibayar: (curr.type?.nominal ?? 0) - curr.amount,
            status:
              curr.amount >= (curr.type?.nominal ?? 0)
                ? PaymentStatus.LUNAS
                : PaymentStatus.BELUM_LUNAS,
            firstPaymentDate: curr.date,
            lastPaymentDate: curr.date,
          };
        } else {
          acc[key].jumlahPembayaran += curr.amount;
          acc[key].jumlahTransaksi += 1;
          acc[key].jumlahHarusDibayar =
            acc[key].jumlahTagihan - acc[key].jumlahPembayaran;
          acc[key].status =
            acc[key].jumlahPembayaran >= acc[key].jumlahTagihan
              ? PaymentStatus.LUNAS
              : PaymentStatus.BELUM_LUNAS;
          acc[key].lastPaymentDate = curr.date;
        }

        return acc;
      },
      {} as Record<string, any>,
    );

    // kasih nomor urut biar rapi
    const data = Object.values(grouped).map((item: any, index: number) => ({
      no: index + 1,
      ...item,
    }));

    return this._success({ data });
  }

  async rekap() {
    const payments = await this.paymentRepo.find({ relations: ['student'] });
    return {
      message: 'List of all payments',
      total: payments.length,
      data: payments,
    };
  }
  async findOne(id: string) {
    const payment = await this.paymentRepo.findOne({
      where: { id },
      relations: ['student'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return {
      message: 'Payment fetched successfully',
      data: payment,
    };
  }

  async updatePayment(
    studentId: string,
    typeId: string,
    year: number,
    updateDto: { status?: string; amount?: number },
  ) {
    // cari payment yang dimaksud
    const payment = await this.paymentRepo.findOne({
      where: { studentId, typeId, year },
      relations: ['student', 'type'],
    });

    if (!payment) {
      throw new NotFoundException('Payment tidak ditemukan');
    }

    // update field yang dikirim
    if (updateDto.status !== undefined) {
      payment.status = updateDto.status as
        | PaymentStatus.BELUM_LUNAS
        | PaymentStatus.LUNAS;
    }
    if (updateDto.amount !== undefined) {
      payment.amount = updateDto.amount;
    }

    await this.paymentRepo.save(payment);

    return this._success({
      data: {
        studentId: payment.studentId,
        typeId: payment.typeId,
        typeName: payment.type.name,
        amount: payment.amount,
        status: payment.status,
      },
    });
  }

  async paymentsByCategory(kategoriName: string) {
    const payments = await this.paymentRepo.find({
      where: { type: { name: kategoriName }, student:{
        isDelete: false
      } },
      relations: ['student', 'type'],
    });

    return this._success({
      data: payments,
    });
  }

  async getPaymentsByCNS(ids: string, idc: string) {
    const Payment = await this.paymentRepo.find({
      where: { studentId: ids, typeId: idc },
    });

    return this._success({
      data: Payment,
    });
  }

  async rekapBulanan(year: number) {
    const students = await this.studentRepo.find({
      where: { isDelete: false },
      relations: ['payments', 'payments.type', 'paymentTypes'], // tambahkan relasi ke paymentTypes
    });
  
    const result = students.map((student) => {
      const payments: { category: string; status: string }[] = [];
  
      // 🔥 hanya ambil kategori yang dimiliki siswa ini
      const studentTypes = student.paymentTypes || [];
  
      studentTypes.forEach((type) => {
        const key = snakeCase(type?.name);
  
        // default BELUM_LUNAS
        let status = 'BELUM_LUNAS';
  
        // kalau siswa punya payment untuk kategori ini → update statusnya
        const paid = student.payments.find(
          (p) => p.type && snakeCase(p.type.name) === key,
        );
  
        if (paid) {
          status =
            paid.status === 'LUNAS'
              ? 'LUNAS'
              : paid.status === 'BELUM LUNAS'
                ? 'BELUM_LUNAS'
                : 'TUNGGAKAN';
        }
  
        payments.push({ category: key, status });
      });
  
      return {
        name: student.name,
        payments,
      };
    });
  
    return this._success({ data: result });
  }
  async remove(id: string) {
    const payment = await this.paymentRepo.findOne({ where: { id } });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    await this.paymentRepo.remove(payment);
    return {
      message: 'Payment deleted successfully',
      data: payment,
    };
  }
}
