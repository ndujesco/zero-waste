import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { GetFarmersByTypeDto } from './dtos/get-farmers-by-type.dto';
import { ErrorService } from 'src/error/error.service';
import { User } from '@prisma/client';
import { GetFarmersFromSearchDto } from './dtos/get-farmers-search';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { hash } from 'bcryptjs';

@Injectable()
export class FarmersService {
  private loggerName = 'FarmersService';

  private infoToOmit = ['password', 'otp'];

  constructor(
    private readonly userRepository: UserRepository,
    private readonly errorService: ErrorService,
  ) {}

  async getFarmersByType(getFarmersByTypeDto: GetFarmersByTypeDto, user: User) {
    const { farmerType } = getFarmersByTypeDto;
    const where = { farmerType };
    let farmers: User[];
    try {
      farmers = await this.userRepository.findUsers({ where });
    } catch (error) {
      this.errorService.throwUnexpectedError(error, this.loggerName);
    }
    farmers = farmers.filter(
      (farmer) => farmer.id !== user.id && farmer.isVerified,
    );

    return farmers.map((farmer) => this.exclude(farmer));
  }

  async getFamersFromSearch(
    getFarmersFromSearchDto: GetFarmersFromSearchDto,
    user: User,
  ) {
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
    farmers = farmers.filter(
      (farmer) => farmer.id !== user.id && farmer.isVerified,
    );

    return farmers.map((farmer) => this.exclude(farmer));
  }

  async deleteFarmer(user: User) {
    let farmer: User;
    try {
      farmer = await this.userRepository.deleteUser({ where: { id: user.id } });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException(
          `A user with the id ${user.id} does not exist`,
        );
      this.errorService.throwUnexpectedError(error, this.loggerName);
    }
    return this.exclude(farmer);
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto, user: User) {
    const { password } = updatePasswordDto;
    const hashedPassword = await hash(password, 10);
    let farmer: User;
    try {
      farmer = await this.userRepository.editUserInfo({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException('No user with the id exists');
      this.errorService.throwUnexpectedError(error, 'FarmerService');
    }

    return this.exclude(farmer);
  }

  exclude(user: User): Partial<User> {
    const { otp, password, ...remaining } = user;
    return remaining;
  }
}
