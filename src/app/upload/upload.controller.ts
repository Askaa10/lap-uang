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
// @UseGuards(JwtGuard)
@Controller('upload')
export class UploadController extends BaseResponse {
  constructor(private readonly cloudinaryService: CloudinaryService) {
    super();
  }

  @UseInterceptors(
    FilesInterceptor('file', 10, {
      storage: diskStorage({
        destination: 'public/uploads',
        filename: (req, file, cb) => {
          const fileExtension = file.originalname.split('.').pop();
          cb(null, `${new Date().getTime()}.${fileExtension}`);
        },
      }),
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (
          !allowedTypes.includes(file.mimetype) ||
          file.size > 2 * 1024 * 1024
        ) {
          return cb(
            new HttpException(
              `Hanya file gambar dan pdf yang berukuran kurang dari 2MB yang bisa di upload, file ${file.originalname} tidak sesuai`,
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
        return cb(null, true);
      },
    }),
  )
  @Post('file')
  async uploadFiles(
    @UploadedFiles() files: Array<MulterFile>,
  ) {
    // proses upload file
    return {
      message: 'Upload berhasil',
      files,
    };
  }

  @Delete('file/delete/:filename')
async DeleteFile(
    @Param('filename') filename: string,
) {
    try {
        const filePath = `public/uploads/${filename}`;
        fs.unlinkSync(filePath);
        return { message: 'File deleted successfully' };
    } catch (err) {
        throw new HttpException('File not Found', HttpStatus.NOT_FOUND);
    }
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
