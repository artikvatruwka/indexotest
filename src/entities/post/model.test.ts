import { postSchema } from './model';

describe('postSchema', () => {
  const validPost = { id: 1, userId: 1, title: 'Title', body: 'Body' };

  it('accepts a valid post', () => {
    expect(postSchema.parse(validPost)).toEqual(validPost);
  });

  it('rejects a post with a missing field', () => {
    expect(() => postSchema.parse({ id: 1, userId: 1, title: 'Title' })).toThrow();
  });

  it('rejects a post with a wrong field type', () => {
    expect(() => postSchema.parse({ ...validPost, id: '1' })).toThrow();
  });

  it('rejects unknown extra fields', () => {
    expect(() => postSchema.parse({ ...validPost, extra: true })).toThrow();
  });
});
