import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateExpenseDto } from './expense.dto';
import { ExpenseService } from './expense.service';
// import { ExpenseCategory } from './expense.category.entity';

@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post('createMany')
  async createExpenses(@Body() dtos: CreateExpenseDto[]) {
    return this.expenseService.createMany(dtos);
  }

  @Post('create')
  async createExpense(@Body() dto: CreateExpenseDto) {
    return this.expenseService.createExpense(dto);
  }

  @Get('')
  async getAll() {
    return this.expenseService.getAll();
  }
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.expenseService.detailById(id);
  }

  @Post('updateExpense/:id')
  async updateExpense(@Param('id') id: string, @Body() updateData: any) {
    return this.expenseService.updateExpense(id, updateData);
  }

  @Delete(':id')
  async deleteExpense(@Param('id') id: string) {
    return this.expenseService.deleteExpense(id);
  }

}
