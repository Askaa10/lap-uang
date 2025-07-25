import {
  IsUUID,
  IsEnum,
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { ExpenseType } from '@prisma/client';

import { PartialType } from '@nestjs/mapped-types';


export class CreateExpenseDto {
  @IsUUID()
  schoolId: string;

  @IsEnum(ExpenseType)
  type: ExpenseType;

  @IsString()
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @IsOptional()
  @IsDateString()
  expenseDate?: string; // ISO string, opsional (default now() di DB)

  @IsOptional()
  @IsString()
  note?: string;
}
export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {}

