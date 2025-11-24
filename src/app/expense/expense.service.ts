import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, Repository } from 'typeorm';
import { Expense } from './expense.entity';
import { BaseResponse } from '../../utils/response/base.response';
import { CreateExpenseDto } from './expense.dto';
import { CategoryExpense } from './category/category-expense.entity';
import { MethodPay } from './sub-category/sub-category.enum';

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
      dtos.map((d: any) =>
        this.expenseRepo.create({
          categoryId: d.categoryId,
          PayDate: d?.PayDate || new Date(),
          pihakPenerima: d.pihakPenerima,
          PenanggungJawab: d?.PenanggungJawab,
          itemCount: d.itemCount,
          Prioritas: d.Prioritas ?? 'BIASA', // fallback default
          sumber_dana: d.sumber_dana,
          ukuran: d.ukuran,
          satuanUkuran: d.satuanUkuran,
          kwitansiUrl: d.kwitansiUrl,
          amount: d.amount,
          description: d.description,
          isDelete: false,
          method: Object.values(MethodPay).includes(d.method as MethodPay)
            ? (d.method as MethodPay)
            : MethodPay.CASH,
          // fallback default
          createdAt: new Date(),
          subCategoryId: d.subCategoryId,
        }),
      ),
    );
    const saved = await this.expenseRepo.save(entities);
    return this._success({ data: saved });
  }
  async findAllByFilter(query: any) {
    const { startDate, endDate, keyword, limit = 10, page = 1 } = query;

    const qb = this.expenseRepo
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.category', 'category')
      .leftJoinAndSelect('expense.subCategory', 'subCategory')
      .where('expense.isDelete = :isDelete', { isDelete: false })
      .orderBy('expense.PayDate', 'DESC') // terbaru ke lama
      .take(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    // --- Filter tanggal ---
    if (startDate && endDate) {
      qb.andWhere('expense.PayDate BETWEEN :start AND :end', {
        start: new Date(startDate),
        end: new Date(endDate),
      });
    }

    // --- Filter keyword ---
    if (keyword) {
      qb.andWhere(
        `(expense.description LIKE :key 
        OR expense.pihakPenerima LIKE :key 
        OR expense.PenanggungJawab LIKE :key)`,
        { key: `%${keyword}%` },
      );
    }

    const [data, total] = await qb.getManyAndCount();

    return {
      message: 'Success',
      total,
      page: Number(page),
      limit: Number(limit),
      data,
    };
  }

  /**
   * ✅ Get all expenses (exclude soft deleted)
   */
  async getAll(categoryName?: string, query?: any) {
    const { startDate, endDate, keyword, limit = 20, page = 1 } = query;

    // Base condition (selalu ada)
    const base = {
      isDelete: false,
      category: {
        isDelete: false,
        ...(categoryName ? { name: categoryName.toLowerCase() } : {}),
      },
    };

    // --- FILTER TANGGAL ---
    if (startDate && endDate) {
      base['PayDate'] = Between(new Date(startDate), new Date(endDate));
    }

    let where: any = base;

    // --- FILTER KEYWORD MULTI FIELD ---
    if (keyword) {
      const key = ILike(`%${keyword}%`);

      where = [
        { ...base, description: key },
        { ...base, pihakPenerima: key },
        { ...base, PenanggungJawab: key },
        // { ...base, itemCount: key },
        { ...base, sumber_dana: key },
        // { ...base, ukuran: key },
        // { ...base, satuanUkuran: key },
        // { ...base, category: { ...base.category, decs: key } },
        // { ...base, category: { ...base.category, name: key } },
        // { ...base, subCategory: { name: key } },
      ];
    }

    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const [data, total] = await this.expenseRepo.findAndCount({
      where,
      relations: ['category', 'subCategory'],
      order: { PayDate: 'DESC' },
      take,
      skip,
    });

    return this._success({
      data: {
        total,
        page: Number(page),
        limit: Number(limit),
        data,
      },
    });
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
