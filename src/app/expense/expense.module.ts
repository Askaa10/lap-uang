import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { typeOrmConfig } from 'src/config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './expense.entity';
import { CategoryExpense } from './category/category-expense.entity';
import { CategoryExpenseService } from './category/category-expense.service';
import { BudgetPlan } from './budget-plant/budget-expense.entity';
import { BudgetExpenseService } from './budget-plant/budget-expense.service';
import { CategoryExpenseController } from './category/caetegory-expense.controller';
// import { ExpenseCategory } from './expense.category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, CategoryExpense,BudgetPlan])],
  providers: [ExpenseService, CategoryExpenseService,BudgetExpenseService],
  controllers: [ExpenseController,CategoryExpenseController,BudgetExpenseService],
  exports: [ExpenseService, CategoryExpenseService,BudgetExpenseService], // jika dipakai di module lain
})
export class ExpenseModule {}
