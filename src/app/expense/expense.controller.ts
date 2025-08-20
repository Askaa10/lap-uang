import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateExpenseDto } from './expense.dto';
import { ExpenseService } from './expense.service';
import { CreateExpenseCategoryDto } from './create-expense-category.dto';
import { ExpenseCategory } from './expense-category.entity';

@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post('createMany')
  async createExpenses(@Body() dtos: CreateExpenseDto[]) {
    return this.expenseService.createMany(dtos);
  }

  @Get('getAll')
  async getAll() {
    return this.expenseService.getAll();
  }

  @Post('updateExpense/:id')
  async updateExpense(@Param('id') id: string, @Body() updateData: any) {
    return this.expenseService.updateExpense(id, updateData);
  }
}
