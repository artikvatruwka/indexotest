import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { PostDetailsView } from './post-details-view';

const mockUsePostQuery = jest.fn();

jest.mock('../hooks/use-post-query', () => ({
  usePostQuery: (id: string) => mockUsePostQuery(id),
}));

function queryState(overrides: Record<string, unknown>) {
  return {
    data: undefined,
    isLoading: false,
    isError: false,
    refetch: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

afterEach(() => {
  mockUsePostQuery.mockReset();
});

describe('PostDetailsView', () => {
  it('queries by the string id from the route', () => {
    mockUsePostQuery.mockReturnValue(queryState({ isLoading: true }));

    render(<PostDetailsView id="5" />);

    expect(mockUsePostQuery).toHaveBeenCalledWith('5');
  });

  it('shows the loading state', () => {
    mockUsePostQuery.mockReturnValue(queryState({ isLoading: true }));

    render(<PostDetailsView id="1" />);

    expect(screen.getByTestId('loading-state')).toBeOnTheScreen();
  });

  it('shows the error state and refetches on retry', async () => {
    const refetch = jest.fn().mockResolvedValue(undefined);
    mockUsePostQuery.mockReturnValue(queryState({ isError: true, refetch }));

    render(<PostDetailsView id="1" />);

    expect(screen.getByText(/Could not load this post/)).toBeOnTheScreen();
    await act(() => {
      fireEvent.press(screen.getByRole('button', { name: 'Try again' }));
    });
    expect(refetch).toHaveBeenCalled();
  });

  it('shows the empty state when the post is not available', () => {
    mockUsePostQuery.mockReturnValue(queryState({ data: undefined }));

    render(<PostDetailsView id="1" />);

    expect(screen.getByText('Post not found.')).toBeOnTheScreen();
  });

  it('renders the full post', () => {
    mockUsePostQuery.mockReturnValue(
      queryState({
        data: { id: 1, userId: 1, title: 'Full title', body: 'Full body text' },
      }),
    );

    render(<PostDetailsView id="1" />);

    expect(screen.getByText('Post #1')).toBeOnTheScreen();
    expect(screen.getByText('Full title')).toBeOnTheScreen();
    expect(screen.getByText('Full body text')).toBeOnTheScreen();
  });
});
