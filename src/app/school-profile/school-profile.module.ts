import { Module } from '@nestjs/common';
import { SchoolProfileService } from './school-profile.service';
import { SchoolProfileController } from './school-profile.controller';
import { SchoolProfile } from './school-profile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SchoolProfile])],
  providers: [SchoolProfileService],
  controllers: [SchoolProfileController],
})
export class SchoolProfileModule {}
