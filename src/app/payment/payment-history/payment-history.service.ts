import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentHistory } from './payment-history.entity';
import { Payment } from '../payment.entity';
import { CreatePaymentHistoryDto, UpdatePaymentHistoryDto } from './payment-history.dto';


@Injectable()
export class PaymentHistoryService {
  constructor(
    @InjectRepository(PaymentHistory)
    private readonly historyRepo: Repository<PaymentHistory>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}

  async create(dto: CreatePaymentHistoryDto) {
    const payment = await this.paymentRepo.findOne({ where: { id: dto.paymentId } });
    if (!payment) throw new NotFoundException('Payment not found');

    const history = this.historyRepo.create({
      payment,
      statusBefore: dto.statusBefore,
      statusAfter: dto.statusAfter,
      note: dto.note,
    });

    return this.historyRepo.save(history);
  }

  async findAll() {
    return this.historyRepo.find({ relations: ['payment'] });
  }

  async findByPayment(paymentId: string) {
    return this.historyRepo.find({
      where: { payment: { id: paymentId } },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, dto: UpdatePaymentHistoryDto) {
    const history = await this.historyRepo.findOne({ where: { id } });
    if (!history) throw new NotFoundException('History not found');

    Object.assign(history, dto);
    return this.historyRepo.save(history);
  }

  async remove(id: string) {
    const history = await this.historyRepo.findOne({ where: { id } });
    if (!history) throw new NotFoundException('History not found');

    return this.historyRepo.remove(history);
  }
}