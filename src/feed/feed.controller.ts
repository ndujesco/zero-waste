import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { FeedService } from './feed.service';
import { CreateUserDto } from '../user/auth/dtos/auth-credentials.dto';

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
  async uploadToFeed(
    @UploadedFiles() file: Express.Multer.File,
    @Body() createPostDto: CreateUserDto,
  ) {
    return;
  }
}
