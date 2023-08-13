import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteMessageDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  socketId: string;
}
