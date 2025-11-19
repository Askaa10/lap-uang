import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentHistory, PaymentHistoryStatus } from './payment-history.entity';
import { Payment, PaymentStatus } from '../payment.entity';
import { PaymentType } from '../payment-type/payment-type.entity';
import { Student } from 'src/app/student/student.entity';
import { CreatePaymentHistoryDto, UpdatePaymentHistoryDto } from './payment-history.dto';
import { BaseResponse } from 'src/utils/response/base.response';
import { CreatePaymentDto } from '../payment.dto';

@Injectable()
export class PaymentHistoryService extends BaseResponse {
  constructor(
    @InjectRepository(PaymentHistory)
    private readonly historyRepo: Repository<PaymentHistory>,

    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,

    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,

    @InjectRepository(PaymentType)
    private readonly typeRepo: Repository<PaymentType>,
  ) {
    super();
  }

  // ✅ CREATE HISTORY
  private toHistoryStatus(status: PaymentStatus): PaymentHistoryStatus {
    switch (status) {
      case PaymentStatus.LUNAS:
        return PaymentHistoryStatus.LUNAS;
      case PaymentStatus.NYICIL:
        return PaymentHistoryStatus.NYICIL;
      case PaymentStatus.TUNGGAKAN:
        return PaymentHistoryStatus.TUNGGAKAN;
      default:
        return PaymentHistoryStatus.BELUM_LUNAS;
    }
  }
  
  async create(dto: CreatePaymentHistoryDto) {
    // --- Cari student ---
    const student = await this.studentRepo.findOneBy({ id: dto.studentId });
    if (!student) throw new NotFoundException("Student not found");
  
    // --- Cari payment type ---
    const type = await this.typeRepo.findOneBy({ id: dto.typeId });
    if (!type) throw new NotFoundException("Payment type not found");
  
    // --- Cari tagihan utama ---
    const payment = await this.paymentRepo.findOne({
      where: {
        student: { id: dto.studentId },
        type: { id: dto.typeId },
      },
      relations: ["student", "type"],
    });
  
    if (!payment)
      throw new NotFoundException("Tagihan payment tidak ditemukan");
  
    // ---- Hitung total pembayaran ----
    const totalPaidBefore = payment.paid;
    const totalPaidAfter = totalPaidBefore + dto.amount;
  
    if (totalPaidAfter > type.nominal) {
      throw new BadRequestException("Jumlah pembayaran melebihi total tagihan!");
    }
  
    const remainder = type.nominal - totalPaidAfter;
  
    // --- Tentukan status payment ---
    let status: PaymentStatus = PaymentStatus.BELUM_LUNAS;
  
    if (totalPaidAfter === type.nominal) {
      status = PaymentStatus.LUNAS;
    } else if (totalPaidAfter > 0) {
      status = PaymentStatus.NYICIL;
    }
  
    // --- Update TAGIHAN PAYMENT ---
    payment.paid = totalPaidAfter;
    payment.remainder = remainder;
    payment.status = status;
  
    await this.paymentRepo.save(payment);
  
    // ======================================================
    //  SELALU MASUK PAYMENT HISTORY (apapun statusnya)
    // ======================================================
    const history = this.historyRepo.create({
      paymentId: payment.id,
      studentId: student.id,
      typeId: type.id,
  
      amount: dto.amount,
      paid: dto.amount,
      remainder: remainder,
  
      status: 
        status === PaymentStatus.LUNAS
          ? PaymentHistoryStatus.LUNAS
          : PaymentHistoryStatus.NYICIL,
  
      method: dto.method ?? null,
      date: dto.date || new Date(),
      month: dto.month ?? new Date().getMonth() + 1,
      year: dto.year ?? new Date().getFullYear(),
  
      payment,
      student,
      type,
    } as Partial<PaymentHistory>);
  
    const savedHistory = await this.historyRepo.save(history);
  
    return this._success({
      message: {
        en: "Payment recorded",
        id: "Pembayaran berhasil dicatat",
      },
      data: {
        payment,
        history: savedHistory,
      },
    });
  }
  // ✅ FIND ALL
  async findAll() {
    const histories = await this.historyRepo.find({
      relations: ['student', 'type', 'payment'],
      order: { createdAt: 'DESC' },
    });

    return this._success({
      message: { en: 'List of all payment histories', id: 'Daftar semua riwayat pembayaran' },
      meta: { total: histories.length },
      data: histories,
    });
  }

  // ✅ FIND ONE
  async findOne(id: string) {
    const history = await this.historyRepo.findOne({
      where: { id },
      relations: ['student', 'type', 'payment'],
    });

    if (!history) throw new NotFoundException('Payment history not found');

    return this._success({
      message: { en: 'Payment history fetched successfully', id: 'Riwayat pembayaran berhasil diambil' },
      data: history,
    });
  }

  // ✅ UPDATE HISTORY
  async update(id: string, dto: UpdatePaymentHistoryDto) {
    const history = await this.historyRepo.findOneBy({ id });
    if (!history) throw new NotFoundException('Payment history not found');

    Object.assign(history, dto);
    const updated = await this.historyRepo.save(history);

    return this._success({
      message: { en: 'Payment history updated successfully', id: 'Riwayat pembayaran berhasil diperbarui' },
      data: updated,
    });
  }

  // ✅ DELETE HISTORY
  async remove(id: string) {
    const history = await this.historyRepo.findOneBy({ id });
    if (!history) throw new NotFoundException('Payment history not found');

    await this.historyRepo.remove(history);
    return this._success({
      message: { en: 'Payment history deleted successfully', id: 'Riwayat pembayaran berhasil dihapus' },
    });
  }
}
