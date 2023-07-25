import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateEmailDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  id: string;
}
