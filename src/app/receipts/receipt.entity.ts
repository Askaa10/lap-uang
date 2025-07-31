import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Payment } from '../payment/payment.entity';


@Entity()
export class Receipt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Payment, (payment) => payment.receipt, {
     onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'paymentId' })
  payment: Payment;

  @Column({ unique: true })
  paymentId: string;

  @CreateDateColumn()
  printedAt: Date;  

  @Column()
  printedBy: string;
}
