import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Module({
  providers: [CloudinaryService]
})
export class FileUploadModule {}
