import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CategoryExpense } from './category/category-expense.entity';
import { MethodPay, Prioritas } from './sub-category/sub-category.enum';
import { SubCategory } from './sub-category/sub-cateogry.entity';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  categoryId: string;

  @ManyToOne(() => CategoryExpense, (category) => category.expenses, {
    onDelete: 'CASCADE',
  })
  category: CategoryExpense;

  @Column({ type: 'timestamp' })
  PayDate: Date;

  @Column()
  pihakPenerima: string;

  @Column()
  PenanggungJawab: string;

  @Column()
  itemCount: string;

  @Column({ type: 'enum', enum: MethodPay, default: MethodPay.CASH })
  method: MethodPay;

  @Column({ type: 'enum', enum: Prioritas, default: Prioritas.BIASA })
  Prioritas: Prioritas;

  @Column()
  sumber_dana: string;

  @Column()
  ukuran: string;

  @Column()
  satuanUkuran: string;

  @Column()
  kwitansiUrl: string;

  @Column()
  amount: number;

  @Column()
  description: string;

  @Column({ default: false })
  isDelete: Boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // @Column({ nullable: false })
  // subCategoryId: number;

  @ManyToOne(() => SubCategory, (sub) => sub.expenses, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'subCategoryId' }) // WAJIB
  subCategory: SubCategory;

  @Column({ type: 'int', nullable: true })
  subCategoryId: number;
}
