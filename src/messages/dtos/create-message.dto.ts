import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsNotEmpty()
  receiverId: string;

  @IsString()
  @IsNotEmpty()
  socketId: string;
}
