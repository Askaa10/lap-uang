import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Payment } from '../payment.entity';

@Entity()
export class PaymentHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Payment, payment => payment.histories, { onDelete: 'CASCADE' })
  payment: Payment;

  @Column()
  statusBefore: string;

  @Column()
  statusAfter: string;

  @Column({ nullable: true })
  note: string;

  @CreateDateColumn()
  createdAt: Date;
}
