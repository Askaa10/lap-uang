import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateArrearDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  typeId: string;

  @IsNumber()
  @IsNotEmpty()
  month: number;

  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsBoolean()
  resolved: boolean;
}


export class UpdateArrearDto extends PartialType(CreateArrearDto) {}