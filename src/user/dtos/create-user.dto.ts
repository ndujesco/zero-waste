import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  homeAddress: string;

  @IsString()
  state: string;
}
