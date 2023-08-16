import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

import { JwtPayload, verify } from 'jsonwebtoken';

@Injectable()
export class WsJwtGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'ws') {
      return true;
    }
    const client: Socket = context.switchToWs().getClient();
    WsJwtGuard.validateToken(client);
    return true;
  }

  static validateToken(client: Socket) {
    const { authorization } = client.handshake.headers;
    const token: string = authorization.split(' ')[1];

    const payload = verify(token, process.env.JWT_SECRET) as JwtPayload;

    client.data.userId = payload.id;

    return payload;
  }
}
