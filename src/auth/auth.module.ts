import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserRepository } from './user.repository';
import { UtilsModule } from 'src/utils/utils.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: ['jwt'],
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // this did not work because the .env filr hadn't yet been read
      signOptions: {
        expiresIn: 7200,
      },
    }),
    PrismaModule,
    UtilsModule,
  ],
  providers: [AuthService, UserRepository],
  controllers: [AuthController],
})
export class AuthModule {}
