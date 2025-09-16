// src/arrears/dto/arrears.dto.ts
import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  IsPositive,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class ArrearsDto {
  @IsOptional() // wajib hanya saat delete
  @IsInt()
  @IsPositive()
  id?: number;

  @IsNotEmpty()
  @IsString()
  studentId: string;

  @IsNotEmpty()
  @IsString()
  typeId: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @IsNotEmpty()
  @IsString()
  semester: string; // "Odd" | "Even"

  @IsNotEmpty()
  @IsInt()
  TA: number; // Tahun Ajaran

  @IsInt()
  @Min(1)
  monthsInArrears: number;
}
