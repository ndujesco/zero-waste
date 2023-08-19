import {
  Body,
  Controller,
  Headers,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { FeedService } from './feed.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { ApiKeyGuard } from 'src/common/guards/api.guard';
import { JwtGuard } from 'src/user/auth/jwt.strategy';
import { GetUser } from 'src/user/auth/get-user-decorator';
import { User } from '@prisma/client';

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + '-' + file.originalname);
  },
});

@UseGuards(ApiKeyGuard, JwtGuard)
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
    @GetUser() user: User,
  ) {
    const posts = await this.feedService.addPost(
      createPostDto,
      user,
      host,
      files,
    );
    return { message: true, posts };
  }
}
