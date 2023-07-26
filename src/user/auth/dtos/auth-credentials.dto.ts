import { Farmer } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  state: string;

  @IsString()
  homeAddress: string;

  @IsEnum(Farmer)
  farmerType: Farmer;
}

export class AuthenticateUserDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
