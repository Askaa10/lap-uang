import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePaymentHistoryDto {
  @IsNotEmpty()
  @IsString()
  paymentId: string;

  @IsNotEmpty()
  @IsString()
  statusBefore: string;

  @IsNotEmpty()
  @IsString()
  statusAfter: string;

  @IsOptional()
  @IsString()
  note?: string;
}

export class UpdatePaymentHistoryDto {
    @IsOptional()
    @IsString()
    statusBefore?: string;
  
    @IsOptional()
    @IsString()
    statusAfter?: string;
  
    @IsOptional()
    @IsString()
    note?: string;
  }