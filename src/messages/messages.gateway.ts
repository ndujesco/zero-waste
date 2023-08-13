import { UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from '../common/guards/ws-jwt.guard';
import { SocketAuthMiddleWare } from '../common/middlewares/ws.middleware';

@UseGuards(WsJwtGuard)
@WebSocketGateway()
export class MessagesGateway implements OnGatewayConnection, OnGatewayInit {
  @WebSocketServer()
  server: Server;

  async afterInit(client: Socket) {
    client.use(SocketAuthMiddleWare() as any);
  }

  async handleConnection(client: Socket) {
    return;
  }

  @SubscribeMessage('join')
  onJoinMessage(client: Socket, body: any) {
    const { roomName } = body;
    const uniquifiedRoomName = (roomName as string)
      .split(' ')
      .sort((a, b) => (a > b ? 1 : -1))
      .join('-and-');

    client.join(uniquifiedRoomName);

    this.server
      .to(client.id)
      .emit('joined', `Werey, you don join, your id na ${client.id}`);
  }
}
