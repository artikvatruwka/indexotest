import { fetchPost, fetchPosts } from './api';

jest.mock('@/shared/lib/delay', () => ({
  delay: jest.fn().mockResolvedValue(undefined),
}));

function mockFetch(body: unknown, ok = true, status = 200, total?: number): jest.Mock {
  const fetchMock = jest.fn().mockResolvedValue({
    ok,
    status,
    json: jest.fn().mockResolvedValue(body),
    headers: {
      get: (name: string) =>
        name === 'X-Total-Count' && total !== undefined ? String(total) : null,
    },
  });
  globalThis.fetch = fetchMock;
  return fetchMock;
}

const post = { id: 1, userId: 1, title: 'Title', body: 'Body' };

afterEach(() => {
  jest.restoreAllMocks();
});

describe('fetchPosts', () => {
  it('requests the page with the page size', async () => {
    mockFetch([]);

    await fetchPosts(3);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/posts?_page=3&_limit=10',
    );
  });

  it('parses the posts and reports hasMore while below the total count', async () => {
    mockFetch(
      Array.from({ length: 10 }, (_, i) => ({ ...post, id: i + 1 })),
      true,
      200,
      100,
    );

    await expect(fetchPosts(1)).resolves.toEqual({ posts: expect.any(Array), hasMore: true });
  });

  it('reports hasMore false on the last full page', async () => {
    mockFetch(
      Array.from({ length: 10 }, (_, i) => ({ ...post, id: i + 1 })),
      true,
      200,
      100,
    );

    await expect(fetchPosts(10)).resolves.toMatchObject({ hasMore: false });
  });

  it('reports hasMore false for a short page', async () => {
    mockFetch([post]);

    await expect(fetchPosts(1)).resolves.toMatchObject({ hasMore: false });
  });

  it('throws on a non-2xx response', async () => {
    mockFetch({}, false, 500);

    await expect(fetchPosts(1)).rejects.toThrow('Request failed with status 500');
  });
});

describe('fetchPost', () => {
  it('requests and parses a single post by string id', async () => {
    mockFetch(post);

    await expect(fetchPost('1')).resolves.toEqual(post);
    expect(globalThis.fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts/1');
  });

  it('throws on a 404', async () => {
    mockFetch({}, false, 404);

    await expect(fetchPost('not-a-post')).rejects.toThrow('Request failed with status 404');
  });
});
