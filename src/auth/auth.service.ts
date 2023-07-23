import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dtos/auth-credentials.dto';
import { User } from '@prisma/client';
import { hash } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, email, phoneNumber, homeAddress, state } =
      createUserDto;
    const hashedPassword = await hash(password, 10);
    const data = {
      username,
      password: hashedPassword,
      email,
      phoneNumber,
      homeAddress,
      state,
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
        throw new InternalServerErrorException('An unexpected error occured');
      }
    }

    return user;
  }

  async signIn() {
    return;
  }
}
