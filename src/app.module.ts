import { Module } from '@nestjs/common';
import { UsersModule } from './user/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { UtilsModule } from './utils/utils.module';
import { MessagesModule } from './messages/messages.module';
import { FileUploadModule } from './file_upload/file_upload.module';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    UtilsModule,
    MessagesModule,
    FileUploadModule,
  ],
})
export class AppModule {}
