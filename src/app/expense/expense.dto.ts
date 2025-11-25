import { Expense } from './expense.entity';

import {
  IsNotEmpty,
  IsUUID,
  IsDateString,
  IsNumber,
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { MethodPay, Prioritas } from './sub-category/sub-category.enum';

export class CreateExpenseDto {
  @IsNotEmpty({ message: 'Kategori wajib dipilih' })
  @IsUUID('4', { message: 'ID kategori tidak valid' })
  categoryId: string;

  @IsNotEmpty({ message: 'Tanggal wajib diisi' })
  @IsDateString({}, { message: 'Format tanggal tidak valid' })
  PayDate: Date; // per entity huruf P besar

  @IsNotEmpty({ message: 'Nominal wajib diisi' })
  @IsNumber({}, { message: 'Nominal harus berupa angka' })
  amount: number;

  @IsNotEmpty({ message: 'Penerima wajib diisi' })
  @IsString()
  pihakPenerima: string;

  @IsNotEmpty({ message: 'Penanggung Jawab wajib diisi' })
  @IsString()
  PenanggungJawab: string;

  @IsNotEmpty({ message: 'Jumlah item wajib diisi' })
  @IsString()
  itemCount: string;

  @IsNotEmpty({ message: 'Metode pembayaran wajib diisi' })
  @IsEnum(MethodPay, { message: 'Metode pembayaran tidak valid' })
  method: MethodPay;

  @IsNotEmpty({ message: 'Prioritas wajib diisi' })
  @IsEnum(Prioritas, { message: 'Prioritas tidak valid' })
  Prioritas: Prioritas;

  @IsNotEmpty({ message: 'Sumber dana wajib diisi' })
  @IsString()
  sumber_dana: string;

  @IsNotEmpty({ message: 'Ukuran wajib diisi' })
  @IsString()
  ukuran: string;

  @IsNotEmpty({ message: 'Satuan ukuran wajib diisi' })
  @IsString()
  satuanUkuran: string;

  @IsNotEmpty({ message: 'Link kwitansi wajib diisi' })
  @IsString()
  kwitansiUrl: string;

  @IsNotEmpty({ message: 'Deskripsi wajib diisi' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'Sub kategori wajib dipilih' })
  @IsNumber({}, { message: 'Sub kategori tidak valid' })
  subCategoryId: number;

  @IsOptional()
  @IsBoolean()
  isDelete?: boolean;
}

export class ExpenseDto {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;

  @IsNotEmpty()
  @IsUUID('4')
  categoryId: string;

  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  description: string;
}
