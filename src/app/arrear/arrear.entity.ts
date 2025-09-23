// src/arrears/entities/arrears.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Student } from '../student/student.entity';
import { PaymentType } from '../payment/payment-type/payment-type.entity';


@Entity('arrears')
export class Arrears {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Student, (student) => student.arrears, { eager: true })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column({ type: 'varchar' })
  studentId: string;

  @ManyToOne(() => PaymentType, (type) => type.arrears, { eager: true })
  @JoinColumn({ name: 'typeId' })
  type: PaymentType;

  @Column({ type: 'varchar' })
  typeId: string;

  @Column({ type: 'varchar' })
  status: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'int' })
  month: number; // 1-12 (January = 1)

  @Column()
  semester: number; // "Odd" | "Even"

  @Column()
  TA: string; // e.g. 2025

  @Column({ type: 'int', default: 1})
  monthsInArrears: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
