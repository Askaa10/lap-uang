import { Expense } from './expense.entity';



import {
  IsNotEmpty,
  IsUUID,
  IsDateString,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateExpenseDto {
  @IsNotEmpty({ message: 'Kategori wajib dipilih' })
  @IsUUID('4', { message: 'ID kategori tidak valid' })
  categoryId: string;

  @IsNotEmpty({ message: 'Tanggal wajib diisi' })
  @IsDateString({}, { message: 'Format tanggal tidak valid' })
  date: Date;

  @IsNotEmpty({ message: 'Jumlah wajib diisi' })
  @IsNumber()
  amount: number;

  @IsNotEmpty({ message: 'Deskripsi wajib diisi' })
  @IsString()
  description: string;
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
