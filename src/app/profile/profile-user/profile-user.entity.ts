import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users_profile')
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  email: string;

  @Column()
  password: string;
}
