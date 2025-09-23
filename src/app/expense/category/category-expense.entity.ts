import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { BudgetPlan } from '../budget-plant/budget-expense.entity';
import { Expense } from '../expense.entity';
// import { BudgetPlan } from './budget-plan.entity';
// import { Expense } from './expense.entity';

@Entity()
export class CategoryExpense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  nominal : number;

  @Column({ nullable: true })
  periode : string;

  @Column({ nullable: true })
  semester: number;

  @Column()
  decs: string;  

  // @OneToMany(() => BudgetPlan, (plan) => plan.category)
  // budgetPlans: BudgetPlan[];

  @OneToMany(() => Expense, (expense) => expense.category)
  expenses: Expense[];

  @CreateDateColumn()
  createdAt: Date;
}
