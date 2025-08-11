import { IsNotEmpty, IsString } from "class-validator";
import { Major } from "./student.enum";

export class StudentDto {
  id?: string;
  name?: string;
  email?: string;
  age?: number;
}

export class CreateStudentDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  regisNumber: string;

  @IsNotEmpty()
  @IsString()
  dorm?: string;

  @IsNotEmpty() 
  generation: number;

  @IsNotEmpty()
  @IsString()
  major: Major;
}


export class UpdateStudentDto {
  id: string;
  name?: string;
  email?: string;
  age?: number;
  dorm?: string;
  generation?: number;
  major?: 'RPL' | 'TKJ';
}