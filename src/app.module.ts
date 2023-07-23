import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [AuthModule, PrismaModule, UtilsModule],
})
export class AppModule {}
