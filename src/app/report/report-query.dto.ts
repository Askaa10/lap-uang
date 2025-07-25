import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class ReportQueryDto {
  @IsOptional()
  @IsString()
  tahun?: string; // contoh: '2025'

  @IsOptional()
  @IsString()
  kelas?: string; // contoh: 'A1'
}

export class CreateSppPaymentDto {
  @IsString()
  studentId: string;

  @IsString()
  feeItemId: string; // pastikan ini id dari fee item SPP

  @IsNumber()
  amountPaid: number;

  @IsDateString()
  paymentDate: string;

  @IsString()
  transactionNo: string;
}