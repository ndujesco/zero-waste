import { Prisma, Message } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageRepository {
  constructor(private prismaService: PrismaService) {}

  async createMessage(params: {
    data: Prisma.MessageCreateInput;
  }): Promise<Message> {
    const { data } = params;
    return this.prismaService.message.create({ data });
  }

  /*
  async findOne(params: {
    where: Prisma.MessageWhereUniqueInput;
  }): Promise<Message> {
    const { where } = params;
    return this.prismaService.message.findUnique({ where });
  }

  async editMessageInfo(params: {
    where: Prisma.MessageWhereUniqueInput;
    data: Prisma.MessageUpdateInput;
  }): Promise<Message> {
    const { where, data } = params;
    return this.prismaService.message.update({ where, data });
  }

  async findMessages(params: {
    where: Prisma.MessageWhereInput;
  }): Promise<Message[]> {
    const { where } = params;
    return this.prismaService.message.findMany({
      where,
    });
  }
*/

  async findDmMessages(params: {
    users: { id1: string; id2: string };
  }): Promise<Message[]> {
    const { id1, id2 } = params.users;
    return this.prismaService.message.findMany({
      where: {
        OR: [
          {
            AND: [
              { receiverId: { contains: id1 } },
              { senderId: { contains: id2 } },
            ],
          },
          {
            AND: [
              { receiverId: { contains: id2 } },
              { senderId: { contains: id1 } },
            ],
          },
        ],
      },
    });
  }

  async deleteMessage(params: {
    where: Prisma.MessageWhereUniqueInput;
  }): Promise<Message> {
    const { where } = params;
    return this.prismaService.message.delete({ where });
  }
}
