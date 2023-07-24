import { Controller, Post, Body } from '@nestjs/common';
import {
  CreateUserDto,
  AuthenticateUserDto,
} from './dtos/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }

  @Post('signin')
  async signIn(@Body() authenticateUserDto: AuthenticateUserDto) {
    return await this.authService.signIn(authenticateUserDto);
  }
}
