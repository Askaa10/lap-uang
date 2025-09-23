import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Nama kategori wajib diisi' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Nominal wajib diisi' })
  @IsNumber()
  @Min(1000, { message: 'Nominal minimal 1000' })
  nominal: number;

  @IsNotEmpty({ message: 'Periode wajib diisi' })
  @IsString()
  periode: string;

  @IsNotEmpty({ message: 'Keterangan wajib diisi' })
  @IsString()
  decs: string;

  @IsNotEmpty({ message: 'Semester wajib diisi' })
  @IsNumber()
  @Min(1, { message: 'Semester minimal 1' })
  semester: number;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
