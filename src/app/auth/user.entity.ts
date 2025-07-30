import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Role } from './auth.enum';
import { ResetPassword } from './resetPassword.entity';
// sesuaikan path-nya

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string; // hashed password

  @Column({ unique: true })
  email: string;

  @Column({ type: 'enum', enum: Role, default: Role.ADMIN })
  role: Role;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  refresh_token?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ResetPassword, (resetPassword) => resetPassword.user)
  resetPasswords: ResetPassword[];
}
