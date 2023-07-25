import { IsEmail, IsString } from 'class-validator';

export class VerifyEmailDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  otp: string;
}
