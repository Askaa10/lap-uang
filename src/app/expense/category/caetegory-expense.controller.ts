import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoryExpenseService } from './category-expense.service';
import { CreateCategoryExpenseDto, UpdateCategoryDto } from './category-expense.dto';

@Controller('expense-category')
export class CategoryExpenseController {
  constructor(private readonly ces: CategoryExpenseService) {}


  @Get()
  async getAll() {
    return this.ces.getAll();
  }

  @Post('create')
  async create(@Body() dto: CreateCategoryExpenseDto) {
    return this.ces.create(dto);
  }

  @Post('create/bulk')
  async createBulk(@Body() dtos: CreateCategoryExpenseDto[]) {
    return this.ces.createBulk(dtos);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.ces.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.ces.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.ces.delete(id);
  }
}
