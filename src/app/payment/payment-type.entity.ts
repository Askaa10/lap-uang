import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Payment } from './payment.entity';
import { Arrear } from '../arrear/arrear.entity';

@Entity()
export class PaymentType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; // contoh: "SPP", "Haul", "Infak", dll



  @Column({ default: 0 })
  semester: number

  @Column({ default : "" })
  TA : string

  @OneToMany(() => Payment, (payment) => payment.type)
  payments: Payment[];

  @OneToMany(() => Arrear, (arrear) => arrear.type)
  arrears: Arrear[];
}
