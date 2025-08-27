import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentType } from './payment-type.entity';
import { CreatePaymentTypeDto, UpdatePaymentTypeDto } from './payment-type.dto';
import { BaseResponse } from '../../../utils/response/base.response';

@Injectable()
export class PaymentTypeService extends BaseResponse {
  constructor(
    @InjectRepository(PaymentType)
    private readonly repo: Repository<PaymentType>,
  ) {
    super();
  }

  async create(dto: CreatePaymentTypeDto) {
    const paymentType = this.repo.create(dto);
    const saved = await this.repo.save(paymentType);
    return this._success({
      auth: null,
      data: saved,
      errors: null,
      links: { self: '/payment-types' },
      included: null,
      message: {
        id: 'Berhasil dibuat',
        en: 'Successfully created',
      },
    });
  }

  async findAll() {
    const types = await this.repo.find();
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

  async findOne(id: string) {
    const found = await this.repo.findOne({ where: { id } });
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

  async update(id: string, dto: UpdatePaymentTypeDto) {
    const existing = await this.repo.preload({ id, ...dto });
    if (!existing) throw new NotFoundException('Payment type not found');

    const updated = await this.repo.save(existing);
    return this._success({
      auth: null,
      data: updated,
      errors: null,
      links: { self: `/payment-types/update/${id}` },
      included: null,
      message: {
        id: 'Data berhasil diperbarui',
        en: 'Data updated successfully',
      },
    });
  }

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
