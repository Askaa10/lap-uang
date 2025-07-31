import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentType } from './payment-type.entity';
import { CreatePaymentTypeDto, UpdatePaymentTypeDto } from './payment-type.dto';
// import { CreatePaymentTypeDto, UpdatePaymentTypeDto } from './payment.dto';

@Injectable()
export class PaymentTypeService {
  constructor(
    @InjectRepository(PaymentType)
    private readonly repo: Repository<PaymentType>,
  ) {}

  async create(dto: CreatePaymentTypeDto) {
    const paymentType = this.repo.create(dto);
    const saved = await this.repo.save(paymentType);
    return {
      message: 'Payment type created',
      data: saved,
    };
  }

  async findAll() {
    const types = await this.repo.find();
    return {
      message: 'All payment types',
      total: types.length,
      data: types,
    };
  }

  async findOne(id: string) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Payment type not found');
    return {
      message: 'Payment type found',
      data: found,
    };
  }

  async update(id: string, dto: UpdatePaymentTypeDto) {
    const existing = await this.repo.preload({ id, ...dto });
    if (!existing) throw new NotFoundException('Payment type not found');

    const updated = await this.repo.save(existing);
    return {
      message: 'Payment type updated',
      data: updated,
    };
  }

  async remove(id: string) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Payment type not found');

    await this.repo.remove(found);
    return {
      message: 'Payment type deleted',
      data: found,
    };
  }
}
