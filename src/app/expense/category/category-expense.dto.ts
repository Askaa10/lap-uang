import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateCategoryExpenseDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @IsString()
  @IsNotEmpty()
  decs: string;

  @IsString()
  @IsNotEmpty()
  kode_kategori: string;

  @IsOptional()
  @IsBoolean()
  isDelete?: boolean;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryExpenseDto) {}
