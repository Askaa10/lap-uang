import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Delete,
  Param,
} from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { v2 as cloudinary } from 'cloudinary';

@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  // Upload via data URI / base64 string
  @Post('file/base64')
  async uploadBase64(@Body() body: { fileBase64: string; publicId?: string }) {
    try {
      const result = await this.cloudinaryService.uploadBase64(body.fileBase64, body.publicId);
      return { message: 'OK', data: result };
    } catch (err) {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  // Upload via base64 (plain) dan decode menjadi Buffer lalu upload (tanpa Multer)
  @Post('file/raw')
  async uploadRaw(@Body() body: { base64: string; publicId?: string }) {
    try {
      if (!body || !body.base64) {
        throw new HttpException('base64 is required', HttpStatus.BAD_REQUEST);
      }
      const base64 = body.base64.replace(/^data:.*;base64,/, '');
      const buffer = Buffer.from(base64, 'base64');
      const result = await this.cloudinaryService.uploadBuffer(buffer, body.publicId);
      return { message: 'OK', data: result };
    } catch (err) {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
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
