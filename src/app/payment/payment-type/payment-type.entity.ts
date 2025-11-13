import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinTable, ManyToMany } from 'typeorm';
import { Payment } from '../payment.entity';
import { Arrears } from '../../arrear/arrear.entity';
import { CategoryTypes } from './payment-type.enum';
import { Student } from 'src/app/student/student.entity';
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

  @OneToMany(() => Arrears, (arrear) => arrear.type)
  arrears: Arrears[];
    // ✅ Relasi baru ke Student
    @ManyToMany(() => Student, (student) => student.paymentTypes, { onDelete: 'CASCADE' })
@JoinTable() // tabel pivot akan dibuat di sini
students: Student[];


}
