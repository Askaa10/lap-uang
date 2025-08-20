// spp-payment.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SppPayment } from './spp-payment.entity';
import { BaseResponse } from 'src/utils/response/base.response';
import { CreateSppPaymentDto, UpdateSppPaymentDto } from './spp-payment.dto';

@Injectable()
export class SppPaymentService extends BaseResponse {
  constructor(
    @InjectRepository(SppPayment)
    private readonly sppPaymentRepository: Repository<SppPayment>,
  ) {
    super();
  }

  async create(dto: CreateSppPaymentDto) {
    const payment = this.sppPaymentRepository.create(dto);
    await this.sppPaymentRepository.save(payment);
    return this._success({ data: payment });
  }

  async findAll() {
    const payments = await this.sppPaymentRepository.find();
    return this._success({ data: payments });
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
