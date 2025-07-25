import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SchoolExpense } from '@prisma/client';
import { CreateExpenseDto, UpdateExpenseDto } from './expense.dto';
import { BaseResponse } from 'src/utils/response/base.response';

@Injectable()
export class ExpenseService extends BaseResponse{
  constructor(private prisma: PrismaService) {super()}

  async create(data: CreateExpenseDto) {
    try {
      const res = await this.prisma.schoolExpense.create({ data });
      return this._success({
        message: {
          id: "",
          en:""
        },
        data: res,
        statusCode: 201,
        statusText: "Created"
      })
      return
    } catch (error) {
      if (error) {
        throw new HttpException('Internal Server Error', 500);
      }
    }
  }

  async findAll() {
    return this.prisma.schoolExpense.findMany();
  }

  async findOne(id: string) {
    const expense = await this.prisma.schoolExpense.findUnique({
      where: { id },
    });
    if (!expense)
      throw new NotFoundException(`Expense with ID ${id} not found`);
    return expense;
  }

  async update(id: string, data: UpdateExpenseDto) {
    await this.findOne(id); // cek existensi
    return this.prisma.schoolExpense.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.schoolExpense.delete({ where: { id } });
  }
}
