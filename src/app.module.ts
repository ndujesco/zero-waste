import { Module } from '@nestjs/common';
import { UsersModule } from './user/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { UtilsModule } from './utils/utils.module';
import { ErrorService } from './error/error.service';

@Module({
  imports: [UsersModule, PrismaModule, UtilsModule],
  providers: [ErrorService],
})
export class AppModule {}
