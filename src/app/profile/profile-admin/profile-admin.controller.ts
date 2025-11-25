import {
  Controller,
  Get,
  Patch,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileAdminService } from './profile-admin.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateSchoolProfileDto } from './profile-admin.dto';

@Controller('profile/admin')
export class ProfileAdminController {
  constructor(private readonly service: ProfileAdminService) {}

  @Get()
  getSchool() {
    return this.service.getSchoolProfile();
  }

  @Patch(':id')
  update(@Body() dto: UpdateSchoolProfileDto) {
    return this.service.updateSchoolProfile(dto);
  }
  // @Patch('avatar')
  // @UseInterceptors(FileInterceptor('avatar'))
  // uploadAvatar(@UploadedFile() file: Express.Multer.File) {
  //   return this.service.updateAvatar(`/uploads/${file.filename}`);
  // }

  // @Patch('banner')
  // @UseInterceptors(FileInterceptor('banner'))
  // uploadBanner(@UploadedFile() file: Express.Multer.File) {
  //   return this.service.updateBanner(`/uploads/${file.filename}`);
  // }
}
