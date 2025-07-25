import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateStudentPaymentDto {
  @IsString()
  studentId: string;

  @IsString()
  feeItemId: string;

  @IsNumber()
  amountPaid: number;

  @IsDateString()
  paymentDate: string;

  @IsString()
  transactionNo: string;

  @IsOptional()
  @IsString()
  note?: string;
}
export class CreateStudentPaymentBulkDto {
  @IsString()
  studentId: string;

  @IsString()
  feeItemName: string;

  @IsNumber()
  amountPaid: number;

  @IsDateString()
  paymentDate: string;

  @IsString()
  transactionNo: string;

  @IsOptional()
  @IsString()
  note?: string;
}

export class UpdateStudentPaymentDto extends PartialType(CreateStudentPaymentDto) {}