import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './expense.entity';
import { BaseResponse } from '../../utils/response/base.response';
import { CreateExpenseDto } from './expense.dto';
import { CategoryExpense } from './category/category-expense.entity';

@Injectable()
export class ExpenseService extends BaseResponse {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepo: Repository<Expense>,
    @InjectRepository(CategoryExpense)
    private readonly categoryRepo: Repository<CategoryExpense>,
  ) {
    super();
  }

  /**
   * ✅ Create a single expense
   */
  async createExpense(dto: CreateExpenseDto) {
    const category = await this.categoryRepo.findOne({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(
        `CategoryExpense with id ${dto.categoryId} not found`,
      );
    }

    const entity = this.expenseRepo.create({
      ...dto,
      category,
      isDelete: false,
    });

    const saved = await this.expenseRepo.save(entity);
    return this._success({ data: saved });
  }

  /**
   * ✅ Create multiple expenses
   */
  async createMany(dtos: CreateExpenseDto[]) {
    const entities = this.expenseRepo.create(
      dtos.map((d) => ({ ...d, isDelete: false })),
    );
    const saved = await this.expenseRepo.save(entities);
    return this._success({ data: saved });
  }

  /**
   * ✅ Get all expenses (exclude soft deleted)
   */
  async getAll() {
    const expenses = await this.expenseRepo.find({
      where: { isDelete: false },
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
    return this._success({ data: expenses });
  }

  /**
   * ✅ Get expense by ID (detail)
   */
  async detailById(id: string) {
    const expense = await this.expenseRepo.findOne({
      where: { id, isDelete: false },
      relations: ['category'],
    });
    if (!expense)
      throw new NotFoundException(`Expense with id ${id} not found`);
    return this._success({ data: expense });
  }

  /**
   * ✅ Update expense (partial)
   */
  async updateExpense(id: string, updateData: Partial<CreateExpenseDto>) {
    const existing = await this.expenseRepo.findOne({
      where: { id, isDelete: false },
    });
    if (!existing)
      throw new NotFoundException(`Expense with id ${id} not found`);

    await this.expenseRepo.update(id, updateData);
    const updatedExpense = await this.expenseRepo.findOne({ where: { id } });
    return this._success({ data: updatedExpense });
  }

  /**
   * 🧹 Soft Delete / Restore (update isDelete flag)
   */
  async updateIsDelete(id: string, isDelete: boolean) {
    const existing = await this.expenseRepo.findOne({ where: { id } });
    if (!existing)
      throw new NotFoundException(`Expense with id ${id} not found`);

    existing.isDelete = isDelete;
    const saved = await this.expenseRepo.save(existing);

    return this._success({
      data: saved,
      message: {
        en: isDelete ? 'Expense soft deleted' : 'Expense restored',
        id: isDelete
          ? 'Pengeluaran dihapus sementara'
          : 'Pengeluaran dipulihkan',
      },
    });
  }

  /**
   * ❌ Hard Delete (permanent)
   */
  async deleteExpense(id: string) {
    const existing = await this.expenseRepo.findOne({ where: { id } });
    if (!existing)
      throw new NotFoundException(`Expense with id ${id} not found`);

    const deleted = await this.expenseRepo.remove(existing);
    return this._success({
      data: deleted,
      message: {
        en: 'Expense permanently deleted',
        id: 'Pengeluaran dihapus permanen',
      },
    });
  }
}
