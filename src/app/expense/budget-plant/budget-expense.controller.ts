import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { BudgetExpenseService } from "./budget-expense.service";
import { createBudgetExpenseDto, updateBudgetExpenseDto } from "./budget-expense.dto";

@Controller('budget-expense')
export class BudgetExpenseController {
    constructor(
        private readonly service: BudgetExpenseService
    ) {}

    @Get()
    async getAll() {
        return await this.service.getAll();
    }

    @Post()
    async create(@Body() createBudgetExpenseDto: createBudgetExpenseDto) {
        return await this.service.create(createBudgetExpenseDto);
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
        return await this.service.getById(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateBudgetExpenseDto: updateBudgetExpenseDto) {
        return await this.service.update(id, updateBudgetExpenseDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.service.delete(id);
    }

}