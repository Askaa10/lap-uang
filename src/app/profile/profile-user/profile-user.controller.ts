import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileUserService } from './profile-user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { cloudinaryStorage } from 'cloudinary/cloudinary.storage';
import { UpdateUserProfileDto } from './profile-user.dto';

@Controller('profile/user')
export class ProfileUserController {
  constructor(private readonly service: ProfileUserService) {}

  @Get(':id')
  getProfile(@Param('id') id: number) {
    return this.service.getUserProfile(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateUserProfileDto) {
    return this.service.updateUserProfile(id, dto);
  }

  // @Patch('avatar/:id')
  // @UseInterceptors(FileInterceptor('avatar', { storage: cloudinaryStorage }))
  // async uploadAvatar(
  //   @Param('id') id: number,
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   return this.service.updateUserAvatar(id, file.path);
  // }

  @Patch('password/:id')
  updatePassword(@Param('id') id: number, @Body('password') password: string) {
    return this.service.changePassword(id, password);
  }
}
