import { Prisma, Post } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FeedRepository {
  constructor(private prismaService: PrismaService) {}

  async createPost(params: { data: Prisma.PostCreateInput }): Promise<Post> {
    const { data } = params;
    return this.prismaService.post.create({
      data,
      include: { links: true, likes: true, comments: true },
    });
  }

  async findPosts(params: { where: Prisma.PostWhereInput }): Promise<Post[]> {
    const { where } = params;
    return this.prismaService.post.findMany({
      where,
    });
  }

  async getAllPosts() {
    return this.prismaService.post.findMany({
      include: { links: true, likes: true, comments: true },
    });
  }

  /*
  async findOne(params: {
    where: Prisma.PostWhereUniqueInput;
  }): Promise<Post> {
    const { where } = params;
    return this.prismaService.post.findUnique({ where });
  }




*/

  async editPostInfo(params: {
    where: Prisma.PostWhereUniqueInput;
    data: Prisma.PostUpdateInput;
  }): Promise<Post> {
    const { where, data } = params;
    return this.prismaService.post.update({
      where,
      data,
    });
  }

  async deletePost(params: {
    where: Prisma.PostWhereUniqueInput;
  }): Promise<Post> {
    const { where } = params;
    return this.prismaService.post.delete({ where });
  }
}
