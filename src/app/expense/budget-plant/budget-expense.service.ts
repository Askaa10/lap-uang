import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BudgetPlan } from './budget-expense.entity';
import { BaseResponse } from 'src/utils/response/base.response';
import { createBudgetExpenseDto, updateBudgetExpenseDto } from './budget-expense.dto';

@Injectable()
export class BudgetExpenseService extends BaseResponse {
  constructor(
    @InjectRepository(BudgetPlan)
    private readonly repo: Repository<BudgetPlan>,
  ) {
    super();
  }

  async getAll() {
    const data = await this.repo.find();
    return this._success({ data });
  }


  async create(dto: createBudgetExpenseDto) {
    // Convert category from string (id) to CategoryExpense object
    const budgetPlan: Partial<BudgetPlan> = {
      ...dto,
      // category: dto.category ? { id: dto.category } as CategoryExpense : undefined,
    };
    const data = await this.repo.save(budgetPlan);
    return this._success({ data });
  }

  async getById(id: string) {
    const data = await this.repo.findOne({ where: { id } });
    return this._success({ data });
  }

  async update(id: string, dto: updateBudgetExpenseDto) {
    const data = await this.repo.update(id, dto);
    return this._success({ data });
  }

  async delete(id: string) {
    const data = await this.repo.delete(id);
    return this._success({ data });
  }


}
