import {
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { BaseResponse } from 'src/utils/response/base.response';

@Controller('upload')
export class UploadController extends BaseResponse {
  constructor(private readonly cloudinaryService: CloudinaryService) {
    super();
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 2 * 1024 * 1024, // 2 MB
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.mimetype)) {
          return cb(
            new HttpException(
              'Hanya JPG, PNG, dan PDF yang diizinkan',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
        return cb(null, true);
      },
    }),
  )
  @Post('cloudinary')
  async uploadToCloudinary(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException(
        'Tidak ada file yang diupload',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.cloudinaryService.uploadFile(file); // file.buffer dipakai
  }

  @Delete('cloudinary/delete/:public_id')
  async deleteImage(@Param('public_id') public_id: string) {
    return this.cloudinaryService.deleteImage(public_id);
  }
}
