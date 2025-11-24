import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.config';

export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ppdb-mq',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  } as any,
});
