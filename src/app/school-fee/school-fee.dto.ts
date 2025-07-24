import { IsString, IsOptional, IsNumber, IsEnum, IsBoolean } from 'class-validator';
import { FeeType } from '@prisma/client';
import { PartialType } from '@nestjs/mapped-types';

export class CreateSchoolFeeItemDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsEnum(FeeType)
  type: FeeType;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  feeGroupId?: string;
}


export class UpdateSchoolFeeItemDto extends PartialType(CreateSchoolFeeItemDto) {}
