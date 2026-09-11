import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';

import { fetchPosts } from '@/entities/post/api';
import type { Post } from '@/entities/post/model';
import { SessionProvider } from '@/entities/session/session-provider';
import { loadSession } from '@/entities/session/storage';

import { usePostsQuery, useResetPosts } from './use-posts-query';

jest.mock('@/shared/lib/delay', () => ({
  delay: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('@/entities/post/api', () => ({
  fetchPosts: jest.fn(),
}));
jest.mock('@/entities/session/storage', () => ({
  loadSession: jest.fn(),
  saveSession: jest.fn(),
  clearAllStorage: jest.fn(),
}));

const fetchPostsMock = fetchPosts as jest.Mock;
const loadMock = loadSession as jest.Mock;

const post = (id: number): Post => ({ id, userId: 1, title: `Post ${String(id)}`, body: 'Body' });

let client: QueryClient;

function makeWrapper() {
  client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <SessionProvider>
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      </SessionProvider>
    );
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  loadMock.mockResolvedValue('stored-token');
  fetchPostsMock.mockResolvedValue({ posts: [], hasMore: false });
});

describe('usePostsQuery', () => {
  it('fetches the first page', async () => {
    const { result } = renderHook(() => usePostsQuery(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchPostsMock).toHaveBeenCalledWith(1);
  });

  it('advances the page while the last page is full', async () => {
    fetchPostsMock.mockResolvedValue({
      posts: Array.from({ length: 10 }, (_, i) => post(i + 1)),
      hasMore: true,
    });

    const { result } = renderHook(() => usePostsQuery(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    await act(async () => {
      await result.current.fetchNextPage();
    });

    expect(fetchPostsMock).toHaveBeenCalledWith(2);
  });

  it('stops paginating when the last page is short', async () => {
    fetchPostsMock.mockResolvedValue({ posts: [post(1)], hasMore: false });

    const { result } = renderHook(() => usePostsQuery(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.hasNextPage).toBe(false);
  });

  it('resets only the posts key and refetches it from page 1', async () => {
    const fetchOther = jest.fn().mockResolvedValue('other');
    const { result } = renderHook(
      () => {
        const query = usePostsQuery();
        const invalidate = useResetPosts();
        const other = useQuery({ queryKey: ['other'], queryFn: fetchOther });
        return { query, invalidate, other };
      },
      { wrapper: makeWrapper() },
    );
    await waitFor(() => expect(result.current.query.isSuccess).toBe(true));
    await waitFor(() => expect(result.current.other.isSuccess).toBe(true));
    const otherCalls = fetchOther.mock.calls.length;

    act(() => {
      result.current.invalidate();
    });

    await waitFor(() => expect(fetchPostsMock).toHaveBeenCalledTimes(3));
    expect(fetchPostsMock).toHaveBeenLastCalledWith(1);
    expect(fetchOther.mock.calls.length).toBe(otherCalls);
  });
});
