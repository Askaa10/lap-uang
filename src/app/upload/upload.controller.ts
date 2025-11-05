import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { BaseResponse } from 'src/utils/response/base.response';

@Controller('upload')
export class UploadController extends BaseResponse {
  constructor(private readonly uploadService: UploadService) {
    super();
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result = await this.uploadService.uploadImage(file);
    return this._success({
      data: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    });
  }
}
