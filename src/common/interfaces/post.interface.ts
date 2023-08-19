import { Post, PostLink, Comment, Like } from '@prisma/client';
export type ExtendedPost = Post & {
  links: PostLink[];
  comments: Comment[];
  likes: Like[];
};
