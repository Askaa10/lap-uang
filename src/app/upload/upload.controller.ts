import {
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtGuard } from '../auth/auth.guard';
import * as fs from 'fs';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { BaseResponse } from 'src/utils/response/base.response';
import { File as MulterFile } from 'multer';
import { File as MulterFileType } from 'multer';
@UseGuards(JwtGuard)
@Controller('upload')
export class UploadController extends BaseResponse {
  constructor(private readonly cloudinaryService: CloudinaryService) {
    super();
  }



  @Post('cloudinary')
  async uploadImage(@UploadedFile() file: MulterFile) {
    return this.cloudinaryService.uploadFile(file);
  }

  @Delete('cloudinary/delete/:public_id')
  async deleteImage(@Param('public_id') public_id: string) {
    return this.cloudinaryService.deleteImage(public_id);
  }
}
