import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from '../student/student.entity';
import { Receipt } from '../receipts/receipt.entity';
import { PaymentType } from './payment-type/payment-type.entity';

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

  @Column()
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

  // ✅ FIXED: cukup relasi ini saja, jangan pakai @Column() tambahan
  @ManyToOne(() => PaymentType, (type) => type.payments, {
    nullable: false, // wajib isi typeId
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'typeId' })
  type: PaymentType;


  @Column()
  remainder : number;

  @Column()
  paid : number;
}
