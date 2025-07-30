import { Module } from '@nestjs/common';
import { SchoolProfileService } from './school-profile.service';
import { SchoolProfileController } from './school-profile.controller';

@Module({
  providers: [SchoolProfileService],
  controllers: [SchoolProfileController]
})
export class SchoolProfileModule {}
