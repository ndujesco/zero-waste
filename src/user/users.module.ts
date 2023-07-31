import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserRepository } from './user.repository';
import { UtilsModule } from 'src/utils/utils.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ApiKeyStrategy } from '../api-strategy';
import { FarmersService } from './farmer/farmers.service';
import { FarmersController } from './farmer/farmers.controller';
import { ErrorService } from 'src/error/error.service';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // this did not work because the .env filr hadn't yet been read
    }),
    PrismaModule,
    UtilsModule,
  ],
  providers: [
    AuthService,
    UserRepository,
    ApiKeyStrategy,
    FarmersService,
    ErrorService,
    JwtStrategy,
  ],
  controllers: [AuthController, FarmersController],
})
export class UsersModule {}
