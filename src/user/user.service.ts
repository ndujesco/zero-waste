import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async signUp() {
    return 'Hello World';
  }
}
