import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary.response';
const streamifier = require('streamifier');
import { Express } from 'express';
 
@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) return reject(error);
          resolve({
            file_url: result.secure_url,
            file_name: result.public_id + '.' + result.format,
            file_size: result.bytes,
            ...result,
          });
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }


  // Tambahkan fungsi ini di CloudinaryService
  async uploadBase64(fileBase64: string) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        fileBase64,
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
  }
}