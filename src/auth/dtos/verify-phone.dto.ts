import { IsString } from 'class-validator';

export class VerifyPhoneDto {
  @IsString()
  phoneNumber: string;

  @IsString()
  phoneOtp: string;
}
