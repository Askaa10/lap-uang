import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { CreatePaymentDto, UpdatePaymentDto } from './payment.dto';
import { PaymentType } from './payment-type.entity';


@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    
    @InjectRepository(PaymentType)
    private readonly paymentTypeRepo: Repository<PaymentType>,
  ) {}

  async create(dto: CreatePaymentDto) {
    const payment = this.paymentRepo.create(dto);
    const saved = await this.paymentRepo.save(payment);
    return {
      message: 'Payment created successfully',
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

  async findOne(id: string) {
    const payment = await this.paymentRepo.findOne({ where: { id }, relations: ['student'] });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return {
      message: 'Payment fetched successfully',
      data: payment,
    };
  }

  async update(id: string, dto: UpdatePaymentDto) {
    const payment = await this.paymentRepo.preload({ id, ...dto });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const updated = await this.paymentRepo.save(payment);
    return {
      message: 'Payment updated successfully',
      data: updated,
    };
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
