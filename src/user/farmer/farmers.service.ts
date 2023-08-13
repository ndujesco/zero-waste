import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { GetFarmersByTypeDto } from './dtos/get-farmers-by-type.dto';
import { User } from '@prisma/client';
import { GetFarmersFromSearchDto } from './dtos/get-farmers-search';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { hash } from 'bcryptjs';
import { EmailService } from '../../utils/email.service';
import { VerifyPasswordDto } from './dtos/verify-password-otp.dto';

@Injectable()
export class FarmersService {
  private otpLifeSpan = 300000; // 5 minutes
  private genRandomOtp = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
  ) {}

  async getFarmersByType(getFarmersByTypeDto: GetFarmersByTypeDto, user: User) {
    const { farmerType } = getFarmersByTypeDto;
    const where = { farmerType };
    let farmers: User[];

    farmers = await this.userRepository.findUsers({ where });

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

    farmers = await this.userRepository.findUsers({ where });

    farmers = farmers.filter(
      (farmer) => farmer.id !== user.id && farmer.isVerified,
    );

    return farmers.map((farmer) => this.exclude(farmer));
  }

  async deleteFarmer(user: User) {
    const farmer = await this.userRepository.findOne({
      where: { id: user.id },
    });

    if (!farmer)
      throw new NotFoundException(
        `A user with the id ${user.id} does not exist`,
      );

    await this.userRepository.deleteUser({ where: { id: user.id } });

    return this.exclude(farmer);
  }

  async requestUpdatePassword(email: string) {
    let farmer = await this.userRepository.findOne({
      where: { email },
    });

    if (!farmer) throw new NotFoundException('No user with this email.');

    const otp = this.genRandomOtp();
    farmer = await this.userRepository.editUserInfo({
      where: { email },
      data: { otp },
    });

    await this.emailService.sendOtpForPasswordReset(
      email,
      otp,
      farmer.username,
    );
    return this.exclude(farmer);
  }

  async verifyPasswordOtp(verifyPasswordDto: VerifyPasswordDto) {
    const { email, otp } = verifyPasswordDto;
    const farmer = await this.userRepository.findOne({ where: { email } });
    if (!farmer)
      throw new NotFoundException('No farmer with this email exists');

    const isExpired =
      Date.now() - farmer.updatedAt.getTime() > this.otpLifeSpan;
    const notMatch = farmer.otp !== otp;

    if (isExpired || notMatch)
      throw new UnauthorizedException('The otp is invalid');

    return this.exclude(farmer);
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto) {
    const { password, email } = updatePasswordDto;
    const userExists = await this.userRepository.findOne({ where: { email } });
    if (!userExists) throw new NotFoundException('No user with this email.');

    const hashedPassword = await hash(password, 10);

    const farmer = await this.userRepository.editUserInfo({
      where: { email },
      data: { password: hashedPassword },
    });

    return this.exclude(farmer);
  }
  exclude(user: User): Partial<User> {
    const { otp, password, ...remaining } = user;
    return remaining;
  }
}
