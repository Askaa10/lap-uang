import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Student } from '../student/student.entity';
import { Receipt } from '../receipts/receipt.entity';
import { PaymentType } from './payment-type/payment-type.entity';
import { PaymentHistory } from './payment-history/payment-history.entity';

export enum PaymentStatus {
  BELUM_LUNAS = 'BELUM LUNAS',
  LUNAS = 'LUNAS',
  TUNGGAKAN = 'TUNGGAKAN',
  NYICIL = 'NYICIL',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  studentId: string;

  @ManyToOne(() => Student, (student) => student.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column({ type: 'datetime', nullable: true })
  date: Date;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.BELUM_LUNAS,
  })
  status: PaymentStatus;

  @Column()
  amount: number;

  @Column({ nullable: true })
  method?: string;

  @Column({ nullable: true })
  month?: number;

  @Column({ nullable: true })
  year?: number;

  @OneToOne(() => Receipt, (receipt) => receipt.payment, {
    cascade: true,
    nullable: true,
  })
  receipt?: Receipt;

  @CreateDateColumn()
  createdAt: Date;

 // RELASI KE PAYMENT TYPE
@ManyToOne(() => PaymentType, (type) => type.payments, {
  nullable: false,
  onDelete: 'RESTRICT',
})
@JoinColumn({ name: 'typeId' })
type: PaymentType;

// RELASI KE PAYMENT HISTORY
@OneToMany(() => PaymentHistory, (history) => history.payment)
histories: PaymentHistory[];
  @Column()
  remainder : number;

  @Column()
  paid : number;
}
