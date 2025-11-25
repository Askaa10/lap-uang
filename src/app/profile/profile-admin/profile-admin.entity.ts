import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('school_profiles')
export class SchoolProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  schoolName: string;

  @Column({ length: 20 })
  schoolId: string;

  @Column({ length: 20 })
  headNip: string;

  @Column({ length: 100 })
  headName: string;

  @Column({ length: 100 })
  email: string;

  @Column({ length: 150 })
  foundation: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 20 })
  academicYear: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  banner: string;
}
