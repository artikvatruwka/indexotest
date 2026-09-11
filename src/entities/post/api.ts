import { API_BASE_URL, PAGE_SIZE } from '@/shared/config/constants';
import { delay } from '@/shared/lib/delay';

import { postSchema, postsSchema, type Post } from './model';

const DEMO_LATENCY_MS = 500;

export interface PostsPage {
  posts: Post[];
  hasMore: boolean;
}

export async function fetchPosts(page: number): Promise<PostsPage> {
  await delay(DEMO_LATENCY_MS);
  const response = await fetch(
    `${API_BASE_URL}/posts?_page=${String(page)}&_limit=${String(PAGE_SIZE)}`,
  );
  if (!response.ok) {
    throw new Error(`Request failed with status ${String(response.status)}`);
  }
  const posts = postsSchema.parse(await response.json());
  const total = Number(response.headers.get('X-Total-Count') ?? 0);
  return { posts, hasMore: page * PAGE_SIZE < total };
}

export async function fetchPost(id: string): Promise<Post> {
  await delay(DEMO_LATENCY_MS);
  const response = await fetch(`${API_BASE_URL}/posts/${id}`);
  if (!response.ok) {
    throw new Error(`Request failed with status ${String(response.status)}`);
  }
  return postSchema.parse(await response.json());
}
