import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateSubCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  // ID kategori dari CategoryExpense (UUID)
  @IsString()
  @IsNotEmpty()
    category_id: string;
    
  @IsBoolean()
  @IsNotEmpty()
  isDelete: Boolean;

  // Optional: kalau nanti ada relasi ke Expense
  @IsOptional()
  @IsString()
  @Length(1, 100)
  expense_id?: string;
}

export class UpdateSubCategoryDto extends PartialType(CreateSubCategoryDto) {}