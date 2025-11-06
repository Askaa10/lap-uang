import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CategoryExpense } from './category/category-expense.entity';
import { Prioritas } from './sub-category/sub-category.enum';

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

  @Column({default: false})
  isDelete: Boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
