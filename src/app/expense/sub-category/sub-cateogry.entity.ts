// import { SubCategory } from './sub-cateogry.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CategoryExpense } from '../category/category-expense.entity';
import { Expense } from '../expense.entity';

@Entity('subcategory')
export class SubCategory {
  @PrimaryGeneratedColumn()
  subCategoryId: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  //   @Column({ nullable: true })
  //   amount: number;

  @Column({ type: 'varchar', nullable: true })
  category_id?: string;

  // @Column({ type: 'varchar', length: 100 })
  // expense_id?: string;
  //   // Relasi ke Category
  @ManyToOne(() => CategoryExpense, (category) => category.subcategory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: CategoryExpense;

  @Column({ default: false })
  isDelete: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // Relasi ke Expense
    @OneToMany(() => Expense, (expense) => expense.subCategory)
    expenses: Expense[];
}
