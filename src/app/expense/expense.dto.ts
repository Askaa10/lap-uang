import { Expense } from './expense.entity';




export class CreateExpenseDto {
  categoryId: string;
  date: Date;
  amount: number;
  description: string;
}


export class ExpenseDto{
    id: string;
    categoryId: string;
    date: Date;
    amount: number;
    description: string;
}