import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileAdminService } from './profile-admin.service';
import { ProfileAdminController } from './profile-admin.controller';
import { SchoolProfileModule } from '../../school-profile/school-profile.module';
import { SchoolProfile } from './profile-admin.entity';

@Module({
   imports: [
    TypeOrmModule.forFeature([SchoolProfile]),
  ],
  controllers: [ProfileAdminController],
  providers: [ProfileAdminService],
  exports: [ProfileAdminService],
})
export class ProfileAdminModule {}
