import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  isString,
  IsString,
  MinLength,
} from 'class-validator';
import { CategoryTypes } from './payment-type.enum';

export class CreatePaymentTypeDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  name: string;

  @IsInt()
  @IsOptional()
  semester: number;
  
  @IsInt()
  @IsOptional()
  nominal: number;

  @IsString()
  @IsOptional()
  TA: string;

  @IsEnum(CategoryTypes)
  @IsOptional()
  type: CategoryTypes;
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
