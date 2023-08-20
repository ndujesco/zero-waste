import { Injectable, HttpException } from '@nestjs/common';
import { FeedRepository } from './feed.repository';
import { CreatePostDto } from './dtos/create-post.dto';
import { User } from '@prisma/client';
import { ExtendedPost } from 'src/common/interfaces/post.interface';
import FileUploadService from 'src/file_upload/file_upload.interface';

@Injectable()
export class FeedService {
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async addPost(
    createPostDto: CreatePostDto,
    user: User,
    host: string,
    files: Express.Multer.File[],
  ) {
    const { text } = createPostDto;

    if (!text && !files) throw new HttpException('Put something na', 422);

    const linksToCreate = files.map((file) => ({ imageLocal: file.filename }));
    const post = await this.feedRepository.createPost({
      data: {
        text,
        author: { connect: { id: user.id } },
        links: { create: linksToCreate },
      },
    });

    try {
      this.fileUploadService.uploadImages(files).then((files) => {
        const linksToUpdate = files.map((file) => ({
          where: { imageLocal: file.original_filename },
          data: { imageId: file.public_id, imageUrl: file.secure_url },
        }));

        this.feedRepository.editPostInfo({
          where: { id: post.id },
          data: {
            links: {
              updateMany: linksToUpdate,
            },
          },
        });
      });
    } catch (err) {
      this.feedRepository.deletePost({ where: { id: post.id } });
      console.log(err);
    }

    return this.postToReturn(post as ExtendedPost, host);
  }

  async gePosts(host: string) {
    const posts = await this.feedRepository.getAllPosts();
    return posts.map((post) => this.postToReturn(post, host));
  }
  postToReturn(post: ExtendedPost, host: string) {
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
