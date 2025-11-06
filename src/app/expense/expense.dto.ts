import { Expense } from './expense.entity';

import {
  IsNotEmpty,
  IsUUID,
  IsDateString,
  IsNumber,
  IsString,
  IsOptional,
} from 'class-validator';
import { Prioritas } from './sub-category/sub-category.enum';

export class CreateExpenseDto {
  @IsNotEmpty({ message: 'Kategori wajib dipilih' })
  @IsUUID('4', { message: 'ID kategori tidak valid' })
  categoryId: string;

  @IsNotEmpty({ message: 'Tanggal wajib diisi' })
  @IsDateString({}, { message: 'Format tanggal tidak valid' })
  payDate: Date;

  @IsNotEmpty({ message: 'Jumlah wajib diisi' })
  @IsNumber()
  amount: number;

  @IsNotEmpty({ message: 'Penerima wajib diisi' })
  @IsString()
  pihakPenerima: string;

  @IsNotEmpty({ message: 'Sumber Dana wajib diisi' })
  @IsString()
  sumber_dana: string;
  
  @IsNotEmpty({ message: 'Penanggung jawab wajib diisi' })
  @IsString()
  penanggungJawab: string;

  @IsNotEmpty({ message: 'Jumlah item wajib diisi' })
  @IsString()
  itemCount: string;

  @IsNotEmpty({ message: 'ukuran wajib diisi' })
  @IsString()
  ukuran: string;

  @IsNotEmpty({ message: 'satuan ukuran wajib diisi' })
  @IsString()
  satuanUkuran: string;

  @IsNotEmpty({ message: 'prioritas wajib diisi' })
  @IsString()
  Prioritas: Prioritas;

  @IsNotEmpty({ message: 'Link kwitansi wajib diisi' })
  @IsString()
  kwitansiUrl: string;

  @IsNotEmpty({ message: 'Deskripsi wajib diisi' })
  @IsString()
  description: string;

  @IsOptional({ message: 'De wajib diisi' })
  @IsString()
  isDelete: string;
  
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
