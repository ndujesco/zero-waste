import {
  Body,
  Controller,
  Headers,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { FeedService } from './feed.service';
import { CreatePostDto } from './dtos/create-post.dto';

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + '-' + file.originalname);
  },
});

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('images', 4, {
      preservePath: true,
      storage,
    }),
  )
  async uploadToFeed(
    @Headers('host') host: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createPostDto: CreatePostDto,
  ) {
    console.log(host);

    const urls = files.map((file) => `${host}/${file.filename}`);
    return { urls };

    return;
  }
}
