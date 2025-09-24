import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Collection } from 'typeorm';
import { CategoryExpense } from './category/category-expense.entity';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  categoryId: string;

  @ManyToOne(() => CategoryExpense, (category) => category.expenses, {onDelete: 'CASCADE'})
  category: CategoryExpense;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column()
  pihakPenerima : string;

  @Column()
  itemCount : string;

  @Column()
  kwitansiUrl : string;
  
  @Column()
  amount: number;
    
  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}
