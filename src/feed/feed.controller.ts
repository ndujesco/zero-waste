import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      preservePath: true,
      storage: memoryStorage(),
    }),
  )
  async uploadToFeed(@UploadedFiles() file: Express.Multer.File) {
    return;
  }
}
