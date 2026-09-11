import { act, fireEvent, render, screen } from '@testing-library/react-native';

import type { Post } from '@/entities/post/model';

import { flattenPages, postKey, PostsList } from './posts-list';

const mockUsePostsQuery = jest.fn();
const mockUseResetPosts = jest.fn();

jest.mock('../hooks/use-posts-query', () => ({
  usePostsQuery: () => mockUsePostsQuery(),
  useResetPosts: () => mockUseResetPosts(),
}));

const post = (id: number): Post => ({
  id,
  userId: 1,
  title: `Post ${String(id)}`,
  body: 'Body '.repeat(30),
});

function queryState(overrides: Record<string, unknown>) {
  return {
    data: undefined,
    isLoading: false,
    isError: false,
    isFetchingNextPage: false,
    hasNextPage: false,
    refetch: jest.fn().mockResolvedValue(undefined),
    fetchNextPage: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

afterEach(() => {
  mockUsePostsQuery.mockReset();
  mockUseResetPosts.mockReset();
});

describe('flattenPages', () => {
  it('returns an empty list for no pages', () => {
    expect(flattenPages(undefined)).toEqual([]);
  });

  it('flattens posts across pages', () => {
    expect(
      flattenPages([{ posts: [post(1), post(2)] }, { posts: [post(3)] }]).map((p) => p.id),
    ).toEqual([1, 2, 3]);
  });
});

describe('postKey', () => {
  it('keys posts by their string id', () => {
    expect(postKey(post(7))).toBe('7');
  });
});

describe('PostsList', () => {
  it('shows the loading state while the first page loads', () => {
    mockUsePostsQuery.mockReturnValue(queryState({ isLoading: true }));

    render(<PostsList onPostPress={jest.fn()} />);

    expect(screen.getByTestId('loading-state')).toBeOnTheScreen();
  });

  it('shows the error state and refetches on retry', async () => {
    const refetch = jest.fn().mockResolvedValue(undefined);
    mockUsePostsQuery.mockReturnValue(queryState({ isError: true, refetch }));

    render(<PostsList onPostPress={jest.fn()} />);

    expect(screen.getByText(/Could not load posts/)).toBeOnTheScreen();
    await act(() => {
      fireEvent.press(screen.getByRole('button', { name: 'Try again' }));
    });
    expect(refetch).toHaveBeenCalled();
  });

  it('shows the empty state when there are no posts', () => {
    mockUsePostsQuery.mockReturnValue(
      queryState({ data: { pages: [{ posts: [], hasMore: false }] } }),
    );

    render(<PostsList onPostPress={jest.fn()} />);

    expect(screen.getByText('No posts yet.')).toBeOnTheScreen();
  });

  it('renders posts with id, title and preview', () => {
    mockUsePostsQuery.mockReturnValue(
      queryState({ data: { pages: [{ posts: [post(1), post(2)], hasMore: true }] } }),
    );

    render(<PostsList onPostPress={jest.fn()} />);

    expect(screen.getByText('Post 1')).toBeOnTheScreen();
    expect(screen.getByText('Post 2')).toBeOnTheScreen();
    expect(screen.getByText('#1')).toBeOnTheScreen();
  });

  it('loads the next page when the list end is reached', () => {
    const fetchNextPage = jest.fn().mockResolvedValue(undefined);
    mockUsePostsQuery.mockReturnValue(
      queryState({
        data: { pages: [{ posts: [post(1)], hasMore: true }] },
        hasNextPage: true,
        fetchNextPage,
      }),
    );

    render(<PostsList onPostPress={jest.fn()} />);
    fireEvent(screen.getByTestId('posts-list'), 'onEndReached');

    expect(fetchNextPage).toHaveBeenCalled();
  });

  it('opens a post on press', () => {
    const onPostPress = jest.fn();
    mockUsePostsQuery.mockReturnValue(
      queryState({ data: { pages: [{ posts: [post(7)], hasMore: false }] } }),
    );

    render(<PostsList onPostPress={onPostPress} />);
    fireEvent.press(screen.getByLabelText(/Post 7:/));

    expect(onPostPress).toHaveBeenCalledWith(post(7));
  });

  it('does not fetch the next page while one is already loading', () => {
    const fetchNextPage = jest.fn().mockResolvedValue(undefined);
    mockUsePostsQuery.mockReturnValue(
      queryState({
        data: { pages: [{ posts: [post(1)], hasMore: true }] },
        hasNextPage: true,
        isFetchingNextPage: true,
        fetchNextPage,
      }),
    );

    render(<PostsList onPostPress={jest.fn()} />);
    fireEvent(screen.getByTestId('posts-list'), 'onEndReached');

    expect(fetchNextPage).not.toHaveBeenCalled();
  });

  it('shows a footer spinner while the next page loads', () => {
    mockUsePostsQuery.mockReturnValue(
      queryState({
        data: { pages: [{ posts: [post(1)], hasMore: true }] },
        hasNextPage: true,
        isFetchingNextPage: true,
      }),
    );

    render(<PostsList onPostPress={jest.fn()} />);

    expect(screen.getByTestId('list-footer')).toBeOnTheScreen();
  });

  it('invalidates the posts query on pull-to-refresh', () => {
    mockUsePostsQuery.mockReturnValue(
      queryState({ data: { pages: [{ posts: [post(1)], hasMore: false }] } }),
    );

    render(<PostsList onPostPress={jest.fn()} />);
    fireEvent(screen.getByTestId('posts-list'), 'refresh');

    expect(mockUseResetPosts).toHaveBeenCalled();
  });

  it('reflects the refetching state in the refresh control', () => {
    mockUsePostsQuery.mockReturnValue(
      queryState({
        data: { pages: [{ posts: [post(1)], hasMore: false }] },
        isRefetching: true,
      }),
    );

    render(<PostsList onPostPress={jest.fn()} />);

    expect(screen.getByTestId('posts-list').props.refreshing).toBe(true);
  });
});
