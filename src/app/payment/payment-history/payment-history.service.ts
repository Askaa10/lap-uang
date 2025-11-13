import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentHistory } from './payment-history.entity';
import { Payment } from '../payment.entity';
import { PaymentType } from '../payment-type/payment-type.entity';
import { Student } from 'src/app/student/student.entity';
import { CreatePaymentHistoryDto, UpdatePaymentHistoryDto } from './payment-history.dto';
import { BaseResponse } from 'src/utils/response/base.response';

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
  async create(dto: CreatePaymentHistoryDto) {
    const payment = await this.paymentRepo.findOneBy({ id: dto.paymentId });
    if (!payment) throw new NotFoundException('Payment not found');

    const student = await this.studentRepo.findOneBy({ id: dto.studentId });
    if (!student) throw new NotFoundException('Student not found');

    const type = await this.typeRepo.findOneBy({ id: dto.typeId });
    if (!type) throw new NotFoundException('Payment type not found');

    const history = this.historyRepo.create({
      ...dto,
      payment,
      student,
      type,
      date: dto.date || new Date(),
    });

    const saved = await this.historyRepo.save(history);
    return this._success({
      message: { en: 'Payment history created successfully', id: 'Riwayat pembayaran berhasil dibuat' },
      data: saved,
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
