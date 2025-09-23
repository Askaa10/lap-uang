import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CategoryExpense } from '../category/category-expense.entity';

@Entity('')
export class BudgetPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @ManyToOne(() => CategoryExpense, (category) => category.budgetPlans, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'category_id' })
  // category: CategoryExpense;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column()
  period: string; // contoh: "2025-09"

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  PJ: string;

  @Column()
  recipient : string

  @Column()
  description : string

  @Column({ nullable: true })
  duration : number

  @Column({ nullable: true })
  Apply_At : Date;

}
