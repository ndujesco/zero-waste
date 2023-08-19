import { Module } from '@nestjs/common';
import { UsersModule } from './user/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { UtilsModule } from './utils/utils.module';
import { MessagesModule } from './messages/messages.module';
import { FileUploadModule } from './file_upload/file_upload.module';
import { FeedModule } from './feed/feed.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../images'),
      serveStaticOptions: { index: false },
    }),
    UsersModule,
    PrismaModule,
    UtilsModule,
    MessagesModule,
    FileUploadModule,
    FeedModule,
  ],
})
export class AppModule {}
