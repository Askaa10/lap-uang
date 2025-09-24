import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Nama kategori wajib diisi' })
  @IsString()
  name: string;


  @IsNotEmpty({ message: 'Keterangan wajib diisi' })
  @IsString()
  decs: string;

}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
