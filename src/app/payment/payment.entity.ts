
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


@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  studentId: string;

  @ManyToOne(() => Student, (student) => student.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column()
  date: Date;

  @Column()
  amount: number;

  @Column({ nullable: true })
  method?: string;

  @Column({ nullable: true })
  month?: number;

  @Column({ nullable: true })
  year?: number;

//   @OneToOne(() => Receipt, (receipt) => receipt.payment, { cascade: true, nullable: true })
//   receipt?: Receipt;

  @CreateDateColumn()
  createdAt: Date;
}