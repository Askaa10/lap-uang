import { IsBoolean, IsInt, IsOptional, isString, IsString, MinLength } from 'class-validator';

export class CreatePaymentTypeDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  name: string;

 @IsInt()
 @IsOptional()
  semseter: number

  @IsString()
  @IsOptional()
  TA: string;
}

export class UpdatePaymentTypeDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  name?: string;
  
  @IsInt()
  @IsOptional()
   semseter: number
 
   @IsString()
   @IsOptional()
   TA: string;
}
