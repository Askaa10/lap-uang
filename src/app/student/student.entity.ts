import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Payment } from '../payment/payment.entity';
import { Major } from './student.enum';

// Define or import the Major enum

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  studentId: string;

  @Column()
  name: string;

  @Column()
  regisNumber: string;

  @Column({ nullable: true })
  dorm?: string;

  @Column()
  generation: number;

  @Column({ type: 'enum', enum: Major })
  major: Major;

  @Column({ default: 0 })
  sppTariff: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Payment, (payment) => payment.student)
  payments: Payment[];


//   @OneToMany(() => Arrear, (arrear) => arrear.student)
//   arrears: Arrear[];
}
