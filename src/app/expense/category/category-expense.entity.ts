import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
// import { BudgetPlan } from '../budget-plant/budget-expense.entity';
import { Expense } from '../expense.entity';
import { SubCategory } from '../sub-category/sub-cateogry.entity';
// import { BudgetPlan } from './budget-plan.entity';
// import { Expense } from './expense.entity';

@Entity('categoryex')
export class CategoryExpense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  decs: string;

  @Column()
  kode_kategori: string;

  @Column({default:false})
  isDelete: Boolean;

  @OneToMany(() => SubCategory, (sub) => sub.category, {
    onDelete: 'CASCADE',
  })
  subcategory: SubCategory;

  @OneToMany(() => Expense, (expense) => expense.category)
  expenses: Expense[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
