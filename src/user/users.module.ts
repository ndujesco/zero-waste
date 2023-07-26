import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserRepository } from './user.repository';
import { UtilsModule } from 'src/utils/utils.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ApiKeyStrategy } from '../api-strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // this did not work because the .env filr hadn't yet been read
      signOptions: {
        expiresIn: 7200,
      },
    }),
    PrismaModule,
    UtilsModule,
  ],
  providers: [AuthService, UserRepository, ApiKeyStrategy],
  controllers: [AuthController],
})
export class UsersModule {}
