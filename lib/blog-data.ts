import { BLOG_POSTS, type BlogPost } from './blog-registry';

export type { BlogPost };

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map(post => post.slug);
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(post => post.slug === slug);
}

export function getAllBlogPosts(): BlogPost[] {
  return [...BLOG_POSTS];
}
