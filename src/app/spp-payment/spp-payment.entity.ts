import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from '../student/student.entity';

@Entity('spp_payments')
export class SppPayment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

 

  @ManyToOne(() => Student, (student) => student.spp, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column()
  studentId: string;

  @Column({
    type: 'enum',
    enum: [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ],
  })
  month: string;

  @Column()
  year: string;

  @Column('int')
  nominal: number;

  @Column({
    type: 'enum',
    enum: ['LUNAS', 'BELUM_LUNAS'],
    default: 'BELUM_LUNAS',
  })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
