import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  'api-key',
) {
  constructor() {
    super({ header: 'apiKey', prefix: '' }, true, async (apiKey, done) => {
      return this.validate(apiKey, done);
    });
  }

  public validate(apiKey: string, done: (error: Error, data) => any) {
    if (process.env.API_KEY === apiKey) {
      done(null, true);
    }
    done(new UnauthorizedException('apiKey is invalid'), null);
  }
}
