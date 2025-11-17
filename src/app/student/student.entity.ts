import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Payment } from '../payment/payment.entity';
import { Major, ProgramType, StudentStatus } from './student.enum';

import { SppPayment } from '../spp-payment/spp-payment.entity';
import { PaymentType } from '../payment/payment-type/payment-type.entity';
import { PaymentHistory } from '../payment/payment-history/payment-history.entity';

// Define or import the Major enum

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  InductNumber: string;

  @Column({ nullable: true })
  dorm: string;

  @Column()
  generation: number;

  @Column({ type: 'enum', enum: StudentStatus, default: StudentStatus.ACTIVE })
  status: StudentStatus;

  @Column({ type: 'enum', enum: Major })
  major: Major;

  @Column({ default: false })
  isDelete: boolean;

  @Column({ unique: false})
  NISN: string;

  // ✅ Kolom baru untuk tipe program
  @Column({ type: 'enum', enum: ProgramType })
  tipeProgram: ProgramType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Payment, (payment) => payment.student)
  payments: Payment[];

  @OneToMany(() => SppPayment, (spp) => spp.student)
  spp: SppPayment[];

  @ManyToMany(() => PaymentType, (paymentType) => paymentType.students)
  paymentTypes: PaymentType[];

  @OneToMany(() => PaymentHistory, (history) => history.student)
paymentHistories: PaymentHistory[];
  
  

}
