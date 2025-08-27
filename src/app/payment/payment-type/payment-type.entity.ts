import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Payment } from '../payment.entity';
import { Arrear } from '../../arrear/arrear.entity';
import { CategoryTypes } from './payment-type.enum';

@Entity()
export class PaymentType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ default: 0 })
  semester: number;

  @Column()
  nominal: number;
  
  @Column({ default: '' })
  TA: string;

  @Column({ default: 'NORMAL' })
  type: CategoryTypes;

  @OneToMany(() => Payment, (payment) => payment.type)
  payments: Payment[];

  @OneToMany(() => Arrear, (arrear) => arrear.type)
  arrears: Arrear[];
}
