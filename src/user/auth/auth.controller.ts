import {
  Controller,
  Post,
  Body,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CreateUserDto,
  AuthenticateUserDto,
} from './dtos/auth-credentials.dto';
import { AuthService } from './auth.service';
import { UpdateEmailDto } from './dtos/update-email.dto';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('api-key'))
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.signUp(createUserDto);
    return { success: true, user };
  }

  @Post('signin')
  async signIn(@Body() authenticateUserDto: AuthenticateUserDto) {
    const user = await this.authService.signIn(authenticateUserDto);
    return { success: true, user };
  }

  @Patch('update-email')
  async updateEmail(@Query() updateEmailDto: UpdateEmailDto) {
    const user = await this.authService.updateEmail(updateEmailDto);
    return { success: true, user };
  }

  @Patch('verify-email')
  async verifyEmail(@Query() verifyEmailDto: VerifyEmailDto) {
    const user = await this.authService.verifyEmail(verifyEmailDto);
    return { success: true, user };
  }
}
