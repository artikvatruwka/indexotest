import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react-native';

import { fetchPosts } from '@/entities/post/api';
import { SessionProvider } from '@/entities/session/session-provider';
import { loadSession } from '@/entities/session/storage';

import { PostsList } from './posts-list';

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

const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });

function renderSession(token: string) {
  loadMock.mockResolvedValue(token);
  return render(
    <SessionProvider>
      <QueryClientProvider client={client}>
        <PostsList onPostPress={jest.fn()} />
      </QueryClientProvider>
    </SessionProvider>,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  fetchPostsMock.mockResolvedValue({ posts: [], hasMore: false });
});

describe('logout → login refetch (regression)', () => {
  it('shows fresh data after a logout wipe and a re-login', async () => {
    const first = renderSession('token-a');
    expect(await screen.findByText('No posts yet.')).toBeOnTheScreen();
    client.clear();
    first.unmount();
    renderSession('token-b');
    expect(await screen.findByText('No posts yet.')).toBeOnTheScreen();
    expect(fetchPostsMock.mock.calls.length).toBeGreaterThanOrEqual(2);
  });
});
