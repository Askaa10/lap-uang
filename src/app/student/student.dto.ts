import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Major, StudentStatus } from "./student.enum";
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
  @IsString()
  dorm: string;

  @IsNotEmpty()
  @IsString()
  NIS: string;

  @IsNotEmpty()
  @IsEnum(Major) // ✅ Pastikan sesuai enum
  major: Major;
}



export class UpdateStudentDto extends PartialType(CreateStudentDto) {}