import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToOne,
    JoinColumn,
  } from 'typeorm';
  import { Student } from '../../student/student.entity';
  import { Receipt } from '../../receipts/receipt.entity';
  import { PaymentType } from '../payment-type/payment-type.entity';
  import { Payment } from '../payment.entity';
  
  export enum PaymentHistoryStatus {
    BELUM_LUNAS = 'BELUM LUNAS',
    LUNAS = 'LUNAS',
    TUNGGAKAN = 'TUNGGAKAN',
    NYICIL = 'NYICIL',
  }
  
  @Entity('payment_histories')
  export class PaymentHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // -------------- RELASI KE PAYMENT --------------
    @Column()
    paymentId: string;

    @ManyToOne(() => Payment, (payment) => payment.histories, {
      onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'paymentId' })
    payment: Payment;

    // -------------- RELASI KE STUDENT --------------
    @Column()
    studentId: string;

    @ManyToOne(() => Student, (student) => student.paymentHistories, {
      onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'studentId' })
    student: Student;

    @Column({ type: 'datetime', nullable: true })
    date: Date;

    @Column({
      type: 'enum',
      enum: PaymentHistoryStatus,
      default: PaymentHistoryStatus.BELUM_LUNAS,
    })
    status: PaymentHistoryStatus;

    @Column()
    amount: number;

    @Column({ nullable: true })
    method?: string;

    @Column({ nullable: true })
    month?: number;

    @Column({ nullable: true })
    year?: number;

    @OneToOne(() => Receipt, {
      cascade: true,
      nullable: true,
    })
    @JoinColumn({ name: 'receiptId' })
    receipt?: Receipt;

    // -------------- RELASI PAYMENT TYPE --------------
    @ManyToOne(() => PaymentType, {
      nullable: false,
      onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'typeId' })
    type: PaymentType;

    @Column()
    remainder: number;

    @Column()
    paid: number;

    @CreateDateColumn()
    createdAt: Date;
  }

  