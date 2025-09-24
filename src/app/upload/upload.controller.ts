import {
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { v2 as cloudinary } from 'cloudinary';
import { Express } from 'express';

@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('file/base64')
  async uploadBase64(@Body() body: { fileBase64: string }) {
    try {
      const result = await this.cloudinaryService.uploadBase64(body.fileBase64);
      return { message: 'OK', data: result };
    } catch (err) {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('file')
  @UseInterceptors(FileInterceptor('file')) // "file" = key form-data
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const result = await this.cloudinaryService.uploadFile(file);
      return { message: 'OK', data: result };
    } catch (err) {
      throw new HttpException('Ada Kesalahan Upload File', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('cloudinary/:publicId')
  async deleteCloudinaryFile(@Param('publicId') publicId: string) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      if (result.result !== 'ok') {
        throw new HttpException('Gagal menghapus file di Cloudinary', HttpStatus.BAD_REQUEST);
      }
      return { message: 'Berhasil menghapus file dari Cloudinary' };
    } catch (err) {
      throw new HttpException('File tidak ditemukan atau sudah dihapus', HttpStatus.NOT_FOUND);
    }
  }
}
