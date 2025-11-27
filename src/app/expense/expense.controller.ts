import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './expense.dto';

@Controller('expense')
export class ExpenseController {
  constructor(private readonly service: ExpenseService) {}
  @Get('')
  @Post()
  create(@Body() dto: CreateExpenseDto) {
    return this.service.createExpense(dto);
  }
  /**
   * ✅ POST /expense/bulk
   * Create multiple expense records at once
   */
  @Post('bulk')
  async createMany(@Body() dtos: CreateExpenseDto[]) {
    return this.service.createMany(dtos);
  }

  @Get('/:ct')
  async getByCategory(
    @Param('ct') categoryName: string,
    @Query() query: any,
  ) {
    return this.service.getAll(categoryName, query);
  }

  @Get('/detail/:id')
  detail(@Param('id') id: string) {
    return this.service.detailById(id);
  }

  @Patch('/update/:id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateExpenseDto>) {
    return this.service.updateExpense(id, dto);
  }

  @Patch(':id/isdelete')
  updateIsDelete(
    @Param('id') id: string,
    @Query('isDelete', ParseBoolPipe) isDelete: boolean,
  ) {
    return this.service.updateIsDelete(id, isDelete);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.deleteExpense(id);
  }
}
