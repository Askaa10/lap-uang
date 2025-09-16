export class createBudgetExpenseDto {
    amount: number;
    category_id: string;
    period: string
}

export class updateBudgetExpenseDto {
    amount: number;
    period: string
}