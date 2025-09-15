import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsNumber, IsString, IsDateString, IsEnum } from 'class-validator';
import { PaymentStatus } from './payment.entity';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

    @IsOptional()
    @IsString()
    method?: string;
    @IsOptional()
    @IsString()
    typeId?: string;

  @IsOptional()
  @IsString()
  typeId?: string;

  // @IsOptional()
  // @IsEnum(['LUNAS', 'BELUM LUNAS'])
  // status?: PaymentStatus;

  @IsOptional()
  @IsNumber()
  month?: number;

  @IsOptional()
  @IsNumber()
  year?: number;
}

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}
