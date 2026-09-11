import { act, render, screen, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';

import { sessionFromToken, SessionProvider, useSession } from './session-provider';
import { clearAllStorage, loadSession, saveSession } from './storage';

jest.mock('expo-crypto', () => ({
  randomUUID: () => '00000000-0000-4000-8000-000000000000',
}));

jest.mock('./storage', () => ({
  loadSession: jest.fn(),
  saveSession: jest.fn(),
  clearAllStorage: jest.fn(),
}));

const loadMock = loadSession as jest.Mock;
const saveMock = saveSession as jest.Mock;
const clearMock = clearAllStorage as jest.Mock;

function Probe() {
  const { session, isReady, signIn, signOut } = useSession();
  return (
    <>
      <Text testID="session">{session === null ? 'none' : session.token}</Text>
      <Text testID="ready">{isReady ? 'ready' : 'not-ready'}</Text>
      <Text
        testID="signIn"
        onPress={() => {
          void signIn();
        }}
      >
        signIn
      </Text>
      <Text
        testID="signOut"
        onPress={() => {
          void signOut();
        }}
      >
        signOut
      </Text>
    </>
  );
}

function renderProbe(onSignOut?: () => void) {
  return render(
    <SessionProvider onSignOut={onSignOut}>
      <Probe />
    </SessionProvider>,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('sessionFromToken', () => {
  it('maps null to no session', () => {
    expect(sessionFromToken(null)).toBeNull();
  });

  it('wraps a token into a session', () => {
    expect(sessionFromToken('token')).toEqual({ token: 'token' });
  });
});

describe('SessionProvider', () => {
  it('throws when useSession is used outside a provider', () => {
    expect(() => render(<Probe />)).toThrow('useSession must be used within a SessionProvider');
  });

  it('stays without a session when the keychain has no token', async () => {
    loadMock.mockResolvedValue(null);

    renderProbe();

    expect(screen.getByTestId('session')).toHaveTextContent('none');
    expect(screen.getByTestId('ready')).toHaveTextContent('not-ready');
    await waitFor(() => expect(screen.getByTestId('ready')).toHaveTextContent('ready'));
    expect(screen.getByTestId('session')).toHaveTextContent('none');
  });

  it('becomes ready without a session when the keychain read fails', async () => {
    loadMock.mockRejectedValue(new Error('keychain unavailable'));

    renderProbe();

    await waitFor(() => expect(screen.getByTestId('ready')).toHaveTextContent('ready'));
    expect(screen.getByTestId('session')).toHaveTextContent('none');
  });

  it('restores the session from the stored token', async () => {
    loadMock.mockResolvedValue('stored-token');

    renderProbe();

    await waitFor(() => expect(screen.getByTestId('session')).toHaveTextContent('stored-token'));
    expect(screen.getByTestId('ready')).toHaveTextContent('ready');
  });

  it('signIn exchanges the code for a token and stores it in the keychain', async () => {
    loadMock.mockResolvedValue(null);
    saveMock.mockResolvedValue(undefined);

    renderProbe();

    await act(() => {
      screen.getByTestId('signIn').props.onPress();
    });

    expect(saveMock).toHaveBeenCalledWith('00000000-0000-4000-8000-000000000000');
    await waitFor(() =>
      expect(screen.getByTestId('session')).toHaveTextContent(
        '00000000-0000-4000-8000-000000000000',
      ),
    );
  });

  it('signOut always calls the latest onSignOut', async () => {
    const first = jest.fn();
    const second = jest.fn();
    loadMock.mockResolvedValue(null);
    clearMock.mockResolvedValue(undefined);

    const { rerender } = renderProbe(first);
    rerender(
      <SessionProvider onSignOut={second}>
        <Probe />
      </SessionProvider>,
    );

    await act(() => {
      screen.getByTestId('signOut').props.onPress();
    });

    await waitFor(() => expect(second).toHaveBeenCalled());
    expect(first).not.toHaveBeenCalled();
  });

  it('signOut wipes storage, clears the session and notifies the host', async () => {
    const onSignOut = jest.fn();
    loadMock.mockResolvedValue('stored-token');
    clearMock.mockResolvedValue(undefined);

    renderProbe(onSignOut);
    await waitFor(() => expect(screen.getByTestId('session')).toHaveTextContent('stored-token'));

    await act(() => {
      screen.getByTestId('signOut').props.onPress();
    });

    expect(clearMock).toHaveBeenCalled();
    expect(screen.getByTestId('session')).toHaveTextContent('none');
    expect(onSignOut).toHaveBeenCalled();
  });

  it('does not update state after unmount while the keychain read is pending', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    loadMock.mockResolvedValue('stored-token');

    const { unmount } = renderProbe();
    unmount();

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(loadMock).toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
