import { 
  IsEnum, 
  IsNotEmpty, 
  IsNumber, 
  IsOptional, 
  IsString, 
  IsDateString 
} from 'class-validator';
import { PaymentHistoryStatus } from './payment-history.entity';

export class CreatePaymentHistoryDto {
  @IsOptional()
  paymentId?: string;

  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  typeId: string;

  @IsOptional()
  @IsDateString()
  date?: Date;

  @IsOptional()
  @IsEnum(PaymentHistoryStatus)
  status?: PaymentHistoryStatus;

  @IsNumber()
  amount: number;

  @IsOptional()
  method?: string;

  @IsOptional()
  month?: number;

  @IsOptional()
  year?: number;

  @IsOptional()
  paid?: number;

  @IsOptional()
  remainder?: number;
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
  @IsNumber()
  month?: number;

  @IsOptional()
  @IsNumber()
  year?: number;

  @IsOptional()
  @IsNumber()
  paid?: number;

  @IsOptional()
  @IsNumber()
  remainder?: number;
}
