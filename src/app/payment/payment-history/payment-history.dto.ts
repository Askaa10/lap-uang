import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaymentHistoryStatus } from './payment-history.entity';

export class CreatePaymentHistoryDto {
  @IsNotEmpty()
  @IsString()
  paymentId: string;

  @IsNotEmpty()
  @IsString()
  studentId: string;

  @IsOptional()
  date?: Date;

  @IsEnum(PaymentHistoryStatus)
  @IsOptional()
  status?: PaymentHistoryStatus;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  method?: string;

  @IsOptional()
  month?: number;

  @IsOptional()
  year?: number;

  @IsNotEmpty()
  @IsString()
  typeId: string;

  @IsNumber()
  paid: number;

  @IsNumber()
  remainder: number;
}

export class UpdatePaymentHistoryDto {
  @IsOptional()
  @IsEnum(PaymentHistoryStatus)
  status?: PaymentHistoryStatus;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  method?: string;

  @IsOptional()
  month?: number;

  @IsOptional()
  year?: number;

  @IsOptional()
  @IsNumber()
  paid?: number;

  @IsOptional()
  @IsNumber()
  remainder?: number;
}
