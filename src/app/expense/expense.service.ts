import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from './expense.entity';
import { Repository } from 'typeorm';
import { BaseResponse } from 'src/utils/response/base.response';
import { CreateExpenseDto } from './expense.dto';

@Injectable()
export class ExpenseService extends BaseResponse {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepo: Repository<Expense>,
  ) {
    super();
  }

  async createMany(dtos: CreateExpenseDto[]) {
    const expenses = this.expenseRepo.create(dtos);
    const saved = await this.expenseRepo.save(expenses);
    return this._success({ data: saved });
  }


  async getAll() {
    const expenses = await this.expenseRepo.find();
    return this._success({ data: expenses });
  }

  async updateExpense(id: string, updateData: Partial<CreateExpenseDto> | any) {
    await this.expenseRepo.update(id, updateData);
    const updatedExpense = await this.expenseRepo.findOne({ where: { id } });
    return this._success({ data: updatedExpense });
  }

  async deleteExpense(id: string) {
    const deleted = await this.expenseRepo.delete(id);
    return this._success({ data: deleted });
  }
}
