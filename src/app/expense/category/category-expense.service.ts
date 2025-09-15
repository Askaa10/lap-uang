import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from "@nestjs/common";
import { BaseResponse } from "src/utils/response/base.response";
import { CategoryExpense } from './category-expense.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './category-expense.dto';

@Injectable()
export class CategoryExpenseService extends BaseResponse {
    constructor(
        @InjectRepository(CategoryExpense)
        private readonly repo: Repository<CategoryExpense>,
    ) {
        super();

    }

    async getAll(){
        const data = await this.repo.find();
        return this._success({ data });
    }

    async create(dto: CreateCategoryDto) {
        const data = await this.repo.save(dto);
        return this._success({ data });
    }

    async createBulk(dtos: CreateCategoryDto[]) {
        const data = await this.repo.save(dtos);
        return this._success({ data });
    }

    async findOne(id: string) {
        const data = await this.repo.findOne({ where: { id } });
        return this._success({ data });
    }

    async update(id: string, dto: CreateCategoryDto) {
        const data = await this.repo.update(id, dto);
        return this._success({ data });
    }

    async delete(id: string) {
        const data = await this.repo.delete(id);
        return this._success({ data });
    }
}