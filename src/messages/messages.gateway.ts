import { UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
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
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private onlineUsers: { userId: string; socketId: string }[] = [];

  async afterInit(client: Socket) {
    client.use(SocketAuthMiddleWare() as any);
  }

  async handleConnection(client: Socket) {
    const userId = client.data.userId;

    !this.onlineUsers.some((user) => user.userId === userId) &&
      this.onlineUsers.push({
        userId,
        socketId: client.id,
      });
    console.log(this.onlineUsers);
    this.server.emit('getOnlineUsers', this.onlineUsers);
  }

  async handleDisconnect(client: Socket) {
    this.onlineUsers = this.onlineUsers.filter(
      ({ socketId }) => socketId !== client.id,
    );
  }

  @SubscribeMessage('join')
  onJoinMessage(client: Socket, body: any) {
    const { receiverId } = body;
    console.log(receiverId);
    console.log(client.data.userId);

    const uniquifiedRoomName = `${client.data.userId} ${receiverId}`
      .split(' ')
      .sort((a, b) => (a > b ? 1 : -1))
      .join('-and-');

    client.join(uniquifiedRoomName);

    this.server
      .to(client.id)
      .emit('joined', `Werey, you don join, your id na ${client.id}`);
  }
}
