import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { GetFarmersByTypeDto } from './dtos/get-farmers-by-type.dto';
import { ErrorService } from 'src/error/error.service';
import { User } from '@prisma/client';
import { GetFarmersFromSearchDto } from './dtos/get-farmers-search';

@Injectable()
export class FarmersService {
  private loggerName = 'FarmersService';
  constructor(
    private readonly userRepository: UserRepository,
    private readonly errorService: ErrorService,
  ) {}

  async getFarmersByType(getFarmersByTypeDto: GetFarmersByTypeDto) {
    const { farmerType } = getFarmersByTypeDto;
    const where = { farmerType };
    let farmers: User[];
    try {
      farmers = await this.userRepository.findUsers({ where });
    } catch (error) {
      this.errorService.throwUnexpectedError(error, this.loggerName);
    }

    return farmers;
  }

  async getFamersFromSearch(getFarmersFromSearchDto: GetFarmersFromSearchDto) {
    let { search } = getFarmersFromSearchDto;
    search = search.trim();
    const where = {
      OR: [
        { email: { contains: search } },
        { username: { contains: search } },
        { phoneNumber: { contains: search } },
        { state: { contains: search } },
        { homeAddress: { contains: search } },
      ],
    };
    let farmers: User[];

    try {
      farmers = await this.userRepository.findUsers({ where });
    } catch (error) {
      this.errorService.throwUnexpectedError(error, this.loggerName);
    }

    return farmers;
  }
}
