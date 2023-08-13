import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { MessagesController } from './messages.controller';
import { MessageRepository } from './message.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MessagesGateway, MessagesService, MessageRepository],
  controllers: [MessagesController],
})
export class MessagesModule {}
