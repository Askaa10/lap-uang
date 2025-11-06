import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Major, ProgramType, StudentStatus } from "./student.enum";
import { PartialType } from "@nestjs/mapped-types";



export class CreateStudentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  InductNumber: string;

  @IsNotEmpty()
  @IsNumber()
  generation: number;

  @IsNotEmpty()
  @IsEnum(StudentStatus) // ✅ Pastikan sesuai enum
  status: StudentStatus;

  @IsNotEmpty()
  @IsEnum(ProgramType)
  tipeProgram: ProgramType;

  @IsNotEmpty()
  @IsString()
  dorm: string;

  @IsNotEmpty()
  @IsString()
  NISN: string;

  @IsNotEmpty()
  @IsEnum(Major) // ✅ Pastikan sesuai enum
  major: Major;
}



export class UpdateStudentDto extends PartialType(CreateStudentDto) {}

export class CreatePaymentDto {
  studentId: string;
  month: number; // 1-12
  year: number;
  amount: number;
  description?: string;
  feeItem?: string; // optional, misal "SPP"
}

export type CreatePaymentBulkDto = CreatePaymentDto[];