import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsInt, IsString, IsUUID } from 'class-validator';

export class CreateInitialBalanceDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  amount: number;

  @IsInt()
  year: number;
}

export class UpdateInitialBalanceDto extends PartialType(CreateInitialBalanceDto) {}