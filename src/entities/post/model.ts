import { z } from 'zod';

export const postSchema = z
  .object({
    id: z.number(),
    userId: z.number(),
    title: z.string(),
    body: z.string(),
  })
  .strict();

export type Post = z.infer<typeof postSchema>;

export const postsSchema = z.array(postSchema);
