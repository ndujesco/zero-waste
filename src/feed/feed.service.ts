import { Injectable } from '@nestjs/common';
import { FeedRepository } from './feed.repository';
import { CreatePostDto } from './dtos/create-post.dto';
import { User } from '@prisma/client';
import { ExtendedPost } from 'src/common/interfaces/post.interface';

@Injectable()
export class FeedService {
  constructor(private readonly feedRepository: FeedRepository) {}

  async addPost(
    createPostDto: CreatePostDto,
    user: User,
    host: string,
    files: Express.Multer.File[],
  ) {
    const { text } = createPostDto;
    const linksToCreate = files.map((file) => ({ imageLocal: file.filename }));
    const post = await this.feedRepository.createPost({
      data: {
        text,
        author: { connect: { id: user.id } },
        links: { create: linksToCreate },
      },
    });
    return this.postToReurn(post as ExtendedPost, host);
  }

  postToReurn(post: ExtendedPost, host: string) {
    return {
      ...post,
      links: post.links.map((link) => ({
        id: link.id,
        url: link.imageUrl
          ? link.imageUrl
          : `http://${host}/${link.imageLocal}`,
      })),
    };
  }
}
