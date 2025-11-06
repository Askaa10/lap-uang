import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  isString,
  IsString,
  MinLength,
} from 'class-validator';
import { CategoryTypes } from './payment-type.enum';
import { Type } from 'class-transformer';

export class CreatePaymentTypeDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  name: string;

  @IsInt()
  @IsOptional()
  semester: number;

  @IsString()
  @IsOptional()
  status: string;
  
  @IsInt()
  @IsOptional()
  nominal: number;

  @IsString()
  @IsOptional()
  TA: string;

  @IsEnum(CategoryTypes)
  @IsOptional()
  type: CategoryTypes;
  
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  studentIds?: number[];
}

export class UpdatePaymentTypeDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  name?: string;

  @IsInt()
  @IsOptional()
  semester?: number;

  @IsInt()
  @IsOptional()
  nominal: number;

  @IsString()
  @IsOptional()
  TA?: string;

  @IsEnum(CategoryTypes)
  @IsOptional()
  type?: CategoryTypes;
}
