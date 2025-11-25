// resetPassword.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('resetpassword')
export class ResetPassword {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  token: string;

  @Column({ nullable: true })
  sessionId: string;

  @Column({ nullable: true })
  sessionCreatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.resetPasswords, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
