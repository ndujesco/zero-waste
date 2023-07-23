import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserRepository } from './user.repository';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [PrismaModule, UtilsModule],
  providers: [AuthService, UserRepository],
  controllers: [AuthController],
})
export class AuthModule {}
