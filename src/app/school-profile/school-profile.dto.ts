import { IsOptional, IsString } from 'class-validator';

export class CreateSchoolProfileDto {
    @IsString()
    name: string;
  
    @IsString()
    foundation: string; // <-- tambahkan ini

    @IsOptional()
    @IsString()
    Nip?: string;
  
    @IsOptional()
    @IsString()
    Email?: string;
  
    @IsOptional()
    @IsString()
    address?: string;
  
    @IsOptional()
    @IsString()
    phone?: string;
  
    @IsOptional()
    @IsString()
    headmaster?: string;
  
    @IsOptional()
    @IsString()
    academicYear?: string;
  }
  

export class UpdateSchoolProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;
  
  @IsString()
  foundation: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  headmaster?: string;

  @IsOptional()
  @IsString()
  academicYear?: string;
}
