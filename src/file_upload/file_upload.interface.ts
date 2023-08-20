import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

export default abstract class FileUploadService {
  abstract uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse>;
  abstract uploadImages(
    files: Express.Multer.File[],
  ): Promise<UploadApiResponse[]>;
}
