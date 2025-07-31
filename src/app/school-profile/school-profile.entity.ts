import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('school_profile')
  export class SchoolProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    name: string; // Nama sekolah
  
    @Column()
    foundation: string;
  
    @Column({ nullable: true })
    address?: string;
  
    @Column({ nullable: true })
    phone?: string;
  
    @Column({ nullable: true })
    headmaster?: string;
  
    @Column({ nullable: true })
    academicYear?: string;
  
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
  }
  