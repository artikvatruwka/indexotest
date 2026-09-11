import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { fetchPosts } from '@/entities/post/api';
import { SessionProvider } from '@/entities/session/session-provider';
import { loadSession } from '@/entities/session/storage';

import { PostsList } from './posts-list';

jest.mock('@/entities/post/api', () => ({
  fetchPosts: jest.fn(),
  fetchPost: jest.fn(),
}));
jest.mock('@/entities/session/storage', () => ({
  loadSession: jest.fn(),
  saveSession: jest.fn(),
  clearAllStorage: jest.fn(),
}));

const fetchPostsMock = fetchPosts as jest.Mock;
const loadMock = loadSession as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  loadMock.mockResolvedValue('stored-token');
  fetchPostsMock.mockResolvedValue({
    posts: [{ id: 1, userId: 1, title: 'Post 1', body: 'Body' }],
    hasMore: false,
  });
});

describe('pull-to-refresh end to end', () => {
  it('refetches when the refresh control fires', async () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });
    render(
      <SessionProvider>
        <QueryClientProvider client={client}>
          <PostsList onPostPress={jest.fn()} />
        </QueryClientProvider>
      </SessionProvider>,
    );

    expect(await screen.findByText('Post 1', {}, { timeout: 3000 })).toBeOnTheScreen();
    const callsAfterMount = fetchPostsMock.mock.calls.length;

    fireEvent(screen.getByTestId('posts-list'), 'refresh');

    await waitFor(() => expect(fetchPostsMock.mock.calls.length).toBeGreaterThan(callsAfterMount), {
      timeout: 3000,
    });
  });
});
