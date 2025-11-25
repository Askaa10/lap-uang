// profile/profile-user/profile-user.module.ts
import { Module } from '@nestjs/common';
import { ProfileUserService } from './profile-user.service';
import { ProfileUserController } from './profile-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Student } from 'src/app/student/student.entity';
import { StudentModule } from 'src/app/student/student.module';
import { UserProfile } from './profile-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserProfile, Student])],
  controllers: [ProfileUserController],
  providers: [ProfileUserService],
  exports: [ProfileUserService],
})
export class ProfileUserModule {}
