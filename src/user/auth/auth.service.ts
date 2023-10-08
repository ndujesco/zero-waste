import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { UserRepository } from '../user.repository';
import {
  AuthenticateUserDto,
  CreateUserDto,
} from './dtos/auth-credentials.dto';
import { User } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../../utils/email.service';
import { UpdateEmailDto } from './dtos/update-email.dto';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { Payload } from './jwt-payload.interface';

type UserInfoToReturn = Partial<User> | { accessToken?: string | null };

@Injectable()
export class AuthService {
  private logger = new Logger('UserService');
  private otpLifeSpan = 300000; // 5 minutes
  private infoToOmit = ['password', 'otp'];

  private genRandomOtp = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<UserInfoToReturn> {
    const {
      username,
      password,
      email,
      phoneNumber,
      homeAddress,
      state,
      farmerType,
    } = createUserDto;
    const hashedPassword = await hash(password, 10);
    const otp = this.genRandomOtp();

    const data = {
      username,
      password: hashedPassword,
      email,
      phoneNumber,
      homeAddress,
      state,
      otp,
      farmerType,
      isVerified: false,
    };

    let user: User;
    try {
      user = await this.userRepository.createUser({ data });
    } catch (error) {
      if (error.code === 'P2002') {
        let inUse;
        if (error.message.includes('email')) inUse = 'email';
        if (error.message.includes('phoneNumber')) inUse = 'phoneNumber';
        throw new ConflictException(`The ${inUse} is already in use`);
      } else {
        this.logger.error(error.message);
        this.throwUnexpectedError(error);
      }
    }
    await this.emailService.sendOtpForEmailVerification(
      email,
      otp,
      user.username,
    );
    return { ...this.exclude(user, this.infoToOmit) };
  }

  async signIn(
    authenticateUserDto: AuthenticateUserDto,
  ): Promise<UserInfoToReturn> {
    const { email, password } = authenticateUserDto;
    let accessToken: string | null = null;
    let user: User;

    try {
      user = await this.userRepository.findOne({ where: { email } });
    } catch (error) {
      this.throwUnexpectedError(error);
    }

    if (!user) throw new NotFoundException('Invalid email or password.');

    const isSame = await compare(password, user.password);
    if (!isSame) throw new UnauthorizedException('Invalid email or password.');

    if (user.isVerified) {
      const payload: Payload = { id: user.id };
      accessToken = await this.jwtService.sign(payload);
    }

    return { ...this.exclude(user, this.infoToOmit), accessToken };
  }

  async updateEmail(updateEmailDto: UpdateEmailDto): Promise<UserInfoToReturn> {
    const { email, id } = updateEmailDto;
    const otp = this.genRandomOtp();
    const data = { email, otp, isVerified: false };

    let possibleUsers: User[];

    try {
      possibleUsers = await this.userRepository.findUsers({
        where: { OR: [{ email }, { id }] },
      });
    } catch (error) {
      throw new NotFoundException('No user with the id exists.');
    }

    const foundUser = possibleUsers.find((user) => user.id === id);
    if (!foundUser) throw new NotFoundException('No user with the id exists.');

    /**
     * Make sure the chosen phone number does not already exist.
     * Even if it does, it should be this user that owns it.
     * i.e, they can 'change' their phone number to the same thing
     */
    if (possibleUsers.length > 1)
      throw new ConflictException('The email is already in use');

    const user = await this.userRepository.editUserInfo({
      where: { id },
      data,
    });

    this.emailService.sendOtpForEmailVerification(
      user.email,
      otp,
      user.username,
    );

    return { ...this.exclude(user, this.infoToOmit) };
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<UserInfoToReturn> {
    //DO NOT FORGET.
    const { email, otp } = verifyEmailDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('No user with this email.');

    const isExpired = Date.now() - user.updatedAt.getTime() > this.otpLifeSpan;
    const notMatch = user.otp !== otp;

    if (isExpired || notMatch)
      throw new UnauthorizedException('The otp is invalid');

    await this.userRepository.editUserInfo({
      where: { email },
      data: { isVerified: true },
    });

    user.isVerified = true;

    const payload: Payload = { id: user.id };
    const accessToken = await this.jwtService.sign(payload);

    return { ...this.exclude(user, this.infoToOmit), accessToken };
  }

  throwUnexpectedError(error) {
    this.logger.error(error.message);
    throw new InternalServerErrorException(
      'An unexpected error has occurred, please try again later',
    );
  }

  exclude<User>(user: User, keys: string[]): UserInfoToReturn {
    return Object.fromEntries(
      Object.entries(user).filter(([key]) => !keys.includes(key)),
    );
  }
}
