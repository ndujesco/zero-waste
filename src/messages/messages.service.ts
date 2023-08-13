import { Injectable, BadRequestException } from '@nestjs/common';
import { MessagesGateway } from './messages.gateway';
import { CreateMessageDto } from './dtos/create-message.dto';
import { Message, User } from '@prisma/client';
import { MessageRepository } from './message.repository';
import { GetMessagesDto } from './dtos/get-messages.dto';
import { DeleteMessageDto } from './dtos/delete-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    private gateway: MessagesGateway,
    private messageRepository: MessageRepository,
  ) {}

  async sendDirectMessage(createMessageDto: CreateMessageDto, user: User) {
    const { text, receiverId, socketId } = createMessageDto;
    const senderId = user.id;

    try {
      await this.messageRepository.createMessage({
        data: {
          text,
          receiver: { connect: { id: receiverId } },
          sender: { connect: { id: senderId } },
        },
      });
    } catch (error) {
      throw new BadRequestException();
    }

    const messages = await this.messageRepository.findDmMessages({
      users: { id1: senderId, id2: receiverId },
    });

    const uniqueRoomName = [senderId, receiverId]
      .sort((a, b) => (a > b ? 1 : -1))
      .join('-and-');

    this.gateway.server
      .to(uniqueRoomName)
      .except(socketId)
      .emit('newMessage', messages);

    return this.modifyMessagesToReturn(messages, senderId);
  }

  async getDirectMessages(getMessagesDto: GetMessagesDto, user: User) {
    const { receiverId } = getMessagesDto;
    const senderId = user.id;
    const messages = await this.messageRepository.findDmMessages({
      users: { id1: senderId, id2: receiverId },
    });

    return this.modifyMessagesToReturn(messages, senderId);
  }

  async deleteMessage(deleteMessageDto: DeleteMessageDto, user: User) {
    const { id, socketId } = deleteMessageDto;
    let message: Message;
    try {
      message = await this.messageRepository.deleteMessage({
        where: { id, senderId: user.id },
      });
    } catch (error) {
      throw new BadRequestException();
    }

    const messages = await this.messageRepository.findDmMessages({
      users: { id1: message.senderId, id2: message.receiverId },
    });

    const uniqueRoomName = [message.senderId, message.receiverId]
      .sort((a, b) => (a > b ? 1 : -1))
      .join('-and-');

    this.gateway.server
      .to(uniqueRoomName)
      .except(socketId)
      .emit('newMessage', messages);

    return this.modifyMessagesToReturn(messages, user.id);
  }

  modifyMessagesToReturn(messages: Message[], senderId) {
    return messages.map((message) => {
      return {
        id: message.id,
        text: message.text,
        updatedAt: message.updatedAt,
        createdAt: message.createdAt,
        status: message.senderId === senderId ? 'sender' : 'receiver',
      };
    });
  }
}
