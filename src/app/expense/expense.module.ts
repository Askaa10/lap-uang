import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { typeOrmConfig } from 'src/config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './expense.entity';
import { CategoryExpense } from './category/category-expense.entity';
import { CategoryExpenseService } from './category/category-expense.service';

import { CategoryExpenseController } from './category/caetegory-expense.controller';

// import { ExpenseCategory } from './expense.category.entity';
import { SubCategoryService } from './sub-category/sub-category.service';
import { SubCategoryController } from './sub-category/sub-category.controller';
import { SubCategory } from './sub-category/sub-cateogry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, CategoryExpense, SubCategory])],
  providers: [ExpenseService, CategoryExpenseService, SubCategoryService],
  controllers: [ExpenseController,CategoryExpenseController, SubCategoryController],
  exports: [ExpenseService], // jika dipakai di module lain
})
export class ExpenseModule {}
