import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Payment } from '../payment/payment.entity';
import { Major, StudentStatus } from './student.enum';

import { SppPayment } from '../spp-payment/spp-payment.entity';
import { Arrears } from '../arrear/arrear.entity';

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

  @Column({default : false})
  isDelete: boolean;

  @Column()
  NIS: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Payment, (payment) => payment.student)
  payments: Payment[];

  @OneToMany(() => Arrears, (arrear) => arrear.student)
  arrears: Arrears[];

  @OneToMany(() => SppPayment, (spp) => spp.student)
  spp: SppPayment[];

}
