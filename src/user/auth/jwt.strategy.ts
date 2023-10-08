import { AuthGuard, PassportStrategy } from '@nestjs/passport';
// import { JwtPayload } from './jwt-payload.interface';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { Payload } from './jwt-payload.interface';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: Payload): Promise<User> {
    const { id } = payload;

    if (!id || !isValidObjectId(id)) throw new UnauthorizedException();

    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}

export class JwtGuard extends AuthGuard('jwt') {}
