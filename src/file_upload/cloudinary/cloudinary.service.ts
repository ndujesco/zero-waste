import { Injectable } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      return cloudinary.uploader.upload(
        file.path,
        { folder: 'zero-waste-feed' },
        (error, result) => {
          if (error) return reject(error);
          resolve({ ...result, original_filename: file.filename });
        },
      );
    });
  }

  async uploadImages(files: Express.Multer.File[]) {
    const urls = await Promise.all(
      files.map(
        async (file): Promise<UploadApiResponse | UploadApiErrorResponse> => {
          return await this.uploadImage(file);
        },
      ),
    );
    return urls;
  }
}
