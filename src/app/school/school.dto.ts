import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSchoolDto {
  @IsOptional()
  schoolName: string;

  @IsNotEmpty()
  nip :string;

  @IsNotEmpty()
  yayasan: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  TA: string;

  @IsNotEmpty()
  HeadSecretariat: string;

  @IsNotEmpty()
  HeadSchool: string;

  @IsOptional()
  logoUrl: string;
}
