import { Controller, Post, Body } from '@nestjs/common';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  @Post('signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto) {
    return 9;
  }
}
