import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';

import { fetchPost } from '@/entities/post/api';
import { SessionProvider } from '@/entities/session/session-provider';
import { loadSession } from '@/entities/session/storage';

import { usePostQuery } from './use-post-query';

jest.mock('@/shared/lib/delay', () => ({
  delay: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('@/entities/post/api', () => ({
  fetchPost: jest.fn(),
}));
jest.mock('@/entities/session/storage', () => ({
  loadSession: jest.fn(),
  saveSession: jest.fn(),
  clearAllStorage: jest.fn(),
}));

const fetchPostMock = fetchPost as jest.Mock;
const loadMock = loadSession as jest.Mock;

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
});

describe('usePostQuery', () => {
  it('fetches the post by its string id', async () => {
    fetchPostMock.mockResolvedValue({ id: 5, userId: 1, title: 'T', body: 'B' });

    const { result } = renderHook(() => usePostQuery('5'), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchPostMock).toHaveBeenCalledWith('5');
    expect(result.current.data).toEqual({ id: 5, userId: 1, title: 'T', body: 'B' });
    expect(client.getQueryData(['post', '5', 'stored-token'])).toEqual({
      id: 5,
      userId: 1,
      title: 'T',
      body: 'B',
    });
  });
});
