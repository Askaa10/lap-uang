import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CategoryExpense } from '../category/category-expense.entity';
import { BaseResponse } from 'src/utils/response/base.response';
import { SubCategory } from './sub-cateogry.entity';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from './sub-category.dto';

@Injectable()
export class SubCategoryService extends BaseResponse {
  constructor(
    @InjectRepository(SubCategory)
    private readonly subRepo: Repository<SubCategory>,

    @InjectRepository(CategoryExpense)
    private readonly catRepo: Repository<CategoryExpense>,
  ) {
    super();
  }

  /**
   * ✅ Get all SubCategories (with optional filter & search)
   */
  async getAll(query?:any ) {
    const { search, category_id } = query || {};

    const where: any = {};
    if (search) where.name = ILike(`%${search}%`);
    if (category_id) where.category = { id: category_id };
    where.isDelete = false;

    const data = await this.subRepo.find({
      where,
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });

    return this._success({
      data,
      links: { self: '/subcategory' },
    });
  }

  /**
   * ✅ Get detail by ID
   */
  async findOne(id: number) {
    const data = await this.subRepo.findOne({
      where: { subCategoryId: id, isDelete: false },
      relations: ['category'],
    });

    if (!data)
      throw new NotFoundException(`SubCategory with id ${id} not found`);

    return this._success({ data });
  }

  /**
   * ✅ Create SubCategory
   */
  async create(dto: CreateSubCategoryDto) {
    const category = await this.catRepo.findOne({
      where: { id: dto.category_id },
    });

    if (!category)
      throw new NotFoundException(
        `Category with id ${dto.category_id} not found`,
      );

    // Cek duplikat nama di kategori yang sama
    const exists = await this.subRepo.findOne({
      where: {
        name: dto.name,
        category: { id: dto.category_id },
        isDelete: false,
      },
    });
    if (exists)
      throw new BadRequestException(
        `SubCategory "${dto.name}" already exists in this category`,
      );

    const entity = this.subRepo.create({
      name: dto.name,
      description: dto.description,
      category,
      category_id: dto.category_id,
      expense_id: dto.expense_id || null,
      isDelete: false,
    });

    const data = await this.subRepo.save(entity);
    return this._success({ data });
  }

  /**
   * ✅ Update SubCategory
   */
  async update(id: number, dto: UpdateSubCategoryDto) {
    const sub = await this.subRepo.findOne({
      where: { subCategoryId: id, isDelete: false },
      relations: ['category'],
    });

    if (!sub)
      throw new NotFoundException(`SubCategory with id ${id} not found`);

    // Ganti kategori kalau perlu
    if (dto.category_id && dto.category_id !== sub.category?.id) {
      const newCategory = await this.catRepo.findOne({
        where: { id: dto.category_id },
      });
      if (!newCategory)
        throw new NotFoundException(
          `Category with id ${dto.category_id} not found`,
        );
      sub.category = newCategory;
      sub.category_id = dto.category_id;
    }

    // Cek nama duplikat di kategori yang sama
    if (dto.name && dto.name !== sub.name) {
      const dup = await this.subRepo.findOne({
        where: {
          name: dto.name,
          category: { id: sub.category?.id },
          isDelete: false,
        },
      });
      if (dup)
        throw new BadRequestException(
          `SubCategory "${dto.name}" already exists in this category`,
        );
    }

    const merged = this.subRepo.merge(sub, dto as any);
    const data = await this.subRepo.save(merged);
    return this._success({ data });
  }

  /**
   * 🧹 Update only isDelete flag (soft delete)
   */
  async updateIsDelete(id: number, isDelete: boolean) {
    const sub = await this.subRepo.findOne({
      where: { subCategoryId: id },
    });

    if (!sub)
      throw new NotFoundException(`SubCategory with id ${id} not found`);

    sub.isDelete = isDelete;
    const data = await this.subRepo.save(sub);
    return this._success({
      data,
      message: {
        en: isDelete ? 'SubCategory soft deleted' : 'SubCategory restored',
        id: isDelete ? 'SubKategori dihapus' : 'SubKategori dipulihkan',
      },
    });
  }

  /**
   * ❌ Hard Delete (hapus permanen)
   */
  async delete(id: number) {
    const sub = await this.subRepo.findOne({
      where: { subCategoryId: id },
    });
    if (!sub)
      throw new NotFoundException(`SubCategory with id ${id} not found`);

    const data = await this.subRepo.remove(sub);
    return this._success({
      data,
      message: {
        en: 'SubCategory permanently deleted',
        id: 'SubKategori dihapus permanen',
      },
    });
  }
}
