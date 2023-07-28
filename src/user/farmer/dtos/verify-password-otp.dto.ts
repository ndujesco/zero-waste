import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyPasswordDto {
  @IsNotEmpty()
  @IsString()
  otp: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}
