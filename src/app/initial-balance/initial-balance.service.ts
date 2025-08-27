import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseResponse } from '../../utils/response/base.response';
import { InitialBalance } from './initial-balance.entity';
import { Repository } from 'typeorm';
import { CreateInitialBalanceDto } from './initial-balance.dto';

@Injectable()
export class InitialBalanceService extends BaseResponse {
  constructor(
    @InjectRepository(InitialBalance)
    private readonly Ibr: Repository<InitialBalance>,
  ) {
    super();
  }

  async create(dto: CreateInitialBalanceDto) {
  const initialBalance = this.Ibr.create({
    description: dto.description,
    amount: dto.amount,
    year: dto.year,
  });

  const created = await this.Ibr.save(initialBalance);

  return this._success({
    message: {
      en: 'Initial balance created successfully',
      id: 'Saldo awal berhasil dibuat',
    },
    data: created,
  });
}

async findAll() {
  const initialBalances = await this.Ibr.find();

  return this._success({
    message: {
      en: 'List of initial balances',
      id: 'Daftar saldo awal',
    },
    data: {
      total: initialBalances.length,
      data: initialBalances,
    },
  });
}

async findOne(id: string) {
  const initialBalance = await this.Ibr.findOne({ where: { id } });

  if (!initialBalance) {
    return this._success({
      message: {
        en: 'Initial balance not found',
        id: 'Saldo awal tidak ditemukan',
      },
      data: null,
    });
  }

  return this._success({
    message: {
      en: 'Initial balance retrieved successfully',
      id: 'Saldo awal berhasil diambil',
    },
    data: initialBalance,
  });
}

async delete(id: string) {
  const initialBalance = await this.Ibr.findOne({ where: { id } });
  if (!initialBalance) {
    return this._success({
      message: {
        en: 'Initial balance not found',
        id: 'Saldo awal tidak ditemukan',
      },
      data: null,
    });
  }

  await this.Ibr.remove(initialBalance);

  return this._success({
    message: {
      en: 'Initial balance deleted successfully',
      id: 'Saldo awal berhasil dihapus',
    },
    data: initialBalance,
  });
}

async update(id: string, updateData: Partial<CreateInitialBalanceDto> | any) {
  const initialBalance = await this.Ibr.findOne({ where: { id } });

  if (!initialBalance) {
    return this._success({
      message: {
        en: 'Initial balance not found',
        id: 'Saldo awal tidak ditemukan',
      },
      data: null,
    });
  }

  const updated = await this.Ibr.save({
    ...initialBalance,
    ...updateData,
  });

  return this._success({
    message: {
      en: 'Initial balance updated successfully',
      id: 'Saldo awal berhasil diperbarui',
    },
    data: updated,
  });
}
}
