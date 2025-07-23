import { IsString, IsInt, IsEnum, IsUUID } from 'class-validator';
import { Major } from '@prisma/client';
import { PartialType } from '@nestjs/mapped-types';

export class siswaDto{
    id: string;
    noInduk : string;
    name: string;
    generation: number;
    class: number;
    major: string;
}

export class CreateStudentDto {
    @IsUUID()
    id:string

    @IsString()
    NoInduk: string;
  
    @IsString()
    name: string;
  
    @IsInt()
    generation: number;
  
    @IsInt()
    class: number;
  
    @IsEnum(Major)
    Major: Major;
  
    @IsUUID()
    schoolId: string;
  }

  export class UpdateStudentDto extends PartialType(CreateStudentDto) {}