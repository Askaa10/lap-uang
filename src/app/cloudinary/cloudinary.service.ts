import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary.response';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  // Upload dari Buffer (tanpa Multer)
  uploadBuffer(buffer: Buffer, publicId?: string): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        publicId ? { public_id: publicId } : undefined,
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

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }

  // Upload dari base64 string (data URI atau plain base64)
  async uploadBase64(fileBase64: string, publicId?: string) {
    // jika data URI, biarkan Cloudinary yang menangani; jika plain base64, prefix
    const isDataUri = /^data:.*;base64,/.test(fileBase64);
    const payload = isDataUri ? fileBase64 : `data:application/octet-stream;base64,${fileBase64}`;

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        payload,
        publicId ? { public_id: publicId } : undefined,
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
    });
  }
}