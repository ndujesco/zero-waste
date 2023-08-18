export default abstract class FileUploadService {
  abstract uploadImage(file: Express.Multer.File): Promise<string>;
  abstract uploadImages(files: Express.Multer.File[]): Promise<string[]>;
}
