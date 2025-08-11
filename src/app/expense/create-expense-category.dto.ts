import { IsNotEmpty } from 'class-validator';

export class CreateExpenseCategoryDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  budget: number;
}
