import { IsNotEmpty, IsString } from 'class-validator';

export class GetFarmersFromSearchDto {
  @IsString()
  @IsNotEmpty()
  search: string;
}
