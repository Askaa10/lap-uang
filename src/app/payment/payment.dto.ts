import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsNumber, IsString, IsDateString } from 'class-validator';

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
  @IsNumber()
  month?: number;

  @IsOptional()
  @IsNumber()
  year?: number;
}

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}
