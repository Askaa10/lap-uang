import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateSppPaymentDto {
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @IsEnum([
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ])
  @IsNotEmpty()
  month: string;

  @IsString()
  @IsNotEmpty()
  year: string;

  @IsInt()
  @IsNotEmpty()
  nominal: number;

  @IsEnum(['LUNAS', 'BELUM_LUNAS'])
  @IsOptional()
  status?: string;
}

export class UpdateSppPaymentDto extends PartialType(CreateSppPaymentDto) {}
