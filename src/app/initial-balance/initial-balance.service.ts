import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseResponse } from 'src/utils/response/base.response';
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

    return {
      message: 'Initial balance created successfully',
      data: created,
    };
  }

  async findAll() {
    const initialBalances = await this.Ibr.find();

    return {
      message: 'List of initial balances',
      total: initialBalances.length,
      data: initialBalances,
    };
  }

  async findOne(id: string) {
    const initialBalance = await this.Ibr.findOne({ where: { id } });

    if (!initialBalance) {
      return {
        message: 'Initial balance not found',
        data: null,
      };
    }

    return {
      message: 'Initial balance retrieved successfully',
      data: initialBalance,
    };
  }

  async delete(id: string) {
    const initialBalance = await this.Ibr.findOne({ where: { id } });
    if (!initialBalance) {
      return {
        message: 'Initial balance not found',
        data: null,
      };
    }

    await this.Ibr.remove(initialBalance);

    return {
      message: 'Initial balance deleted successfully',
      data: initialBalance,
    };
  }

  async update(id: string, updateData: Partial<CreateInitialBalanceDto> | any) {
    const initialBalance = await this.Ibr.findOne({ where: { id } });

    if (!initialBalance) {
      return {
        message: 'Initial balance not found',
        data: null,
      };
    }

    const updated = await this.Ibr.save({
      ...initialBalance,
      ...updateData,
    });

    return {
      message: 'Initial balance updated successfully',
      data: updated,
    };
  }
}
