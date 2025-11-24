import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { ProfileUserModule } from './profile-user/profile-user.module';
import { ProfileAdminModule } from './profile-admin/profile-admin.module';

@Module({
  imports: [ProfileUserModule, ProfileAdminModule],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
