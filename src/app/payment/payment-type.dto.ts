import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePaymentTypeDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  name: string;

  @IsOptional()
  @IsBoolean({ message: 'isMonthly must be a boolean' })
  isMonthly?: boolean;
}

export class UpdatePaymentTypeDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  name?: string;

  @IsOptional()
  @IsBoolean({ message: 'isMonthly must be a boolean' })
  isMonthly?: boolean;
}
