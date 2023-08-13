import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dtos/create-message.dto';
import { JwtGuard } from '../user/auth/jwt.strategy';
import { ApiKeyGuard } from 'src/common/guards/api.guard';
import { GetUser } from 'src/user/auth/get-user-decorator';
import { User } from '@prisma/client';
import { GetMessagesDto } from './dtos/get-messages.dto';
import { DeleteMessageDto } from './dtos/delete-message.dto';

@UseGuards(ApiKeyGuard, JwtGuard)
@Controller('messages')
export class MessagesController {
  constructor(private service: MessagesService) {}

  @Post('direct-message')
  async sendDirectMessage(
    @Body() createMessageDto: CreateMessageDto,
    @GetUser() user: User,
  ) {
    const messages = await this.service.sendDirectMessage(
      createMessageDto,
      user,
    );
    return { success: true, messages };
  }

  @Get('direct-messages/:receiverId')
  async getDirectMessages(
    @Param() getMessagesDto: GetMessagesDto,
    @GetUser() user: User,
  ) {
    const messages = await this.service.getDirectMessages(getMessagesDto, user);
    return { success: true, messages };
  }

  @Delete('direct-message')
  async deleteDirectMessage(
    @Query() deleteMessageDto: DeleteMessageDto,
    @GetUser() user: User,
  ) {
    const messages = await this.service.deleteMessage(deleteMessageDto, user);
    return { success: true, messages };
  }
}
