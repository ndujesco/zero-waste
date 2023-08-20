import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { FeedRepository } from './feed.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FileUploadModule } from 'src/file_upload/file_upload.module';

@Module({
  imports: [PrismaModule, FileUploadModule],
  providers: [FeedService, FeedRepository],
  controllers: [FeedController],
})
export class FeedModule {}
