import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { ExpenseCategory } from './expense-category.entity';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  categoryId: string;

  @ManyToOne(() => ExpenseCategory, (category) => category.expenses, {
    onDelete: 'CASCADE',
  })
  category: ExpenseCategory;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column()
  amount: number;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}
