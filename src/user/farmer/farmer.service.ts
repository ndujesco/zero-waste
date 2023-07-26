import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user.repository';

@Injectable()
export class FarmerService {
  constructor(private readonly userRepository: UserRepository) {}

  // async get
}
