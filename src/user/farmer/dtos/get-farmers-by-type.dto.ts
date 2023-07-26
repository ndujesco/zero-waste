import { Farmer } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class GetFarmersByTypeDto {
  @IsEnum(Farmer)
  farmerType: Farmer;
}
