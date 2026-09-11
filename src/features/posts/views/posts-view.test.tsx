import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Pressable } from 'react-native';

import { SessionProvider } from '@/entities/session/session-provider';
import { clearAllStorage, loadSession } from '@/entities/session/storage';

import { PostsList } from '../ui/posts-list';
import { PostsView } from './posts-view';

const mockPush = jest.fn();
const mockScreenOptions: unknown[] = [];

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
  Stack: {
    Screen: (props: unknown) => {
      mockScreenOptions.push(props);
      return null;
    },
  },
}));
jest.mock('../ui/posts-list', () => ({
  PostsList: jest.fn(),
}));

const postsListMock = PostsList as jest.Mock;
jest.mock('@/entities/session/storage', () => ({
  loadSession: jest.fn(),
  saveSession: jest.fn(),
  clearAllStorage: jest.fn(),
}));

const loadMock = loadSession as jest.Mock;
const clearMock = clearAllStorage as jest.Mock;

function renderView() {
  return render(
    <SessionProvider>
      <PostsView />
    </SessionProvider>,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  mockScreenOptions.length = 0;
  loadMock.mockResolvedValue('stored-token');
  clearMock.mockResolvedValue(undefined);
  postsListMock.mockImplementation(
    ({ onPostPress }: { onPostPress: (post: { id: number }) => void }) => (
      <Pressable
        testID="post-stub"
        onPress={() => {
          onPostPress({ id: 7 });
        }}
      />
    ),
  );
});

describe('PostsView', () => {
  it('renders the slim header with title and sign-out, and the list', () => {
    renderView();

    expect(screen.getByText('Posts')).toBeOnTheScreen();
    expect(screen.getByText('Sign out')).toBeOnTheScreen();
    expect(screen.getByTestId('post-stub')).toBeOnTheScreen();
  });

  it('signs out and clears storage from the header button', async () => {
    renderView();

    fireEvent.press(screen.getByText('Sign out'));

    await waitFor(() => expect(clearMock).toHaveBeenCalled());
  });

  it('hides the native header and sets the Posts route title', () => {
    renderView();

    expect(mockScreenOptions[0]).toEqual({ options: { headerShown: false, title: 'Posts' } });
  });

  it('navigates to the details route with the post id as a string', () => {
    renderView();

    fireEvent.press(screen.getByTestId('post-stub'));

    expect(mockPush).toHaveBeenCalledWith({ pathname: '/post/[id]', params: { id: '7' } });
  });
});
