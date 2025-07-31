import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Payment } from './payment.entity';

@Entity()
export class PaymentType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; // contoh: "SPP", "Haul", "Infak", dll

  @Column({ default: false })
  isMonthly: boolean; // true jika jenis ini dibayar per bulan

  @OneToMany(() => Payment, (payment) => payment.type)
  payments: Payment[];
}
