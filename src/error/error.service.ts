import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@Injectable()
export class ErrorService {
  throwUnexpectedError(error, name: string) {
    const logger = new Logger(name);
    logger.error(error.message);
    throw new InternalServerErrorException(
      'An unexpected error has occurred, please try again later',
    );
  }
}
