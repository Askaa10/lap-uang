import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinTable, ManyToMany } from 'typeorm';
import { Payment } from '../payment.entity';
import { CategoryTypes } from './payment-type.enum';
import { Student } from '../../student/student.entity';
import { PaymentHistory } from '../payment-history/payment-history.entity';


@Entity()
export class PaymentType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ default: 0 })
  semester: number;

  @Column()
  nominal: number;

  @Column({ default: 'ACTIVE' })
  status: string;
  
  @Column({ default: '2025/2026' })
  TA: string;

  @Column({ default: 'NORMAL' })
  type: CategoryTypes;

  @OneToMany(() => Payment, (payment) => payment.type)
  payments: Payment[];

  @ManyToMany(() => Student, (student) => student.paymentTypes)
  students: Student[];

  @OneToMany(() => PaymentHistory, (history) => history.type)
  histories: PaymentHistory[];

}
