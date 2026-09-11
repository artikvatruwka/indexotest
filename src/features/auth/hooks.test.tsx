import { act, renderHook, waitFor } from '@testing-library/react-native';

import { SessionProvider } from '@/entities/session/session-provider';
import { loadSession, saveSession } from '@/entities/session/storage';

import { useLogin } from './hooks';

jest.mock('@/entities/session/storage', () => ({
  loadSession: jest.fn(),
  saveSession: jest.fn(),
  clearAllStorage: jest.fn(),
}));

const loadMock = loadSession as jest.Mock;
const saveMock = saveSession as jest.Mock;

function makeWrapper() {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>;
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  loadMock.mockResolvedValue(null);
  saveMock.mockResolvedValue(undefined);
});

describe('useLogin', () => {
  it('does not validate while the code is incomplete', () => {
    const { result } = renderHook(() => useLogin(), { wrapper: makeWrapper() });

    act(() => {
      result.current.handleChange('01020');
    });

    expect(result.current.error).toBeNull();
    expect(saveMock).not.toHaveBeenCalled();
  });

  it('signs in automatically once the valid code is complete', async () => {
    const { result } = renderHook(() => useLogin(), { wrapper: makeWrapper() });

    act(() => {
      result.current.handleChange('01020312345');
    });

    await waitFor(() => expect(saveMock).toHaveBeenCalled());
  });

  it('shows an error for a complete but unknown code', async () => {
    const { result } = renderHook(() => useLogin(), { wrapper: makeWrapper() });

    act(() => {
      result.current.handleChange('99999999999');
    });

    await waitFor(() => expect(result.current.error).toMatch(/does not match/));
    expect(saveMock).not.toHaveBeenCalled();
  });

  it('clears the error on edit and re-validates when complete again', async () => {
    const { result } = renderHook(() => useLogin(), { wrapper: makeWrapper() });

    act(() => {
      result.current.handleChange('99999999999');
    });
    await waitFor(() => expect(result.current.error).toMatch(/does not match/));

    act(() => {
      result.current.handleChange('9999999999');
    });
    expect(result.current.error).toBeNull();

    act(() => {
      result.current.handleChange('99999999999');
    });
    await waitFor(() => expect(result.current.error).toMatch(/does not match/));
    expect(saveMock).not.toHaveBeenCalled();
  });

  it('shows an error when sign-in fails and allows retrying after edit', async () => {
    saveMock.mockRejectedValue(new Error('keychain write failed'));

    const { result } = renderHook(() => useLogin(), { wrapper: makeWrapper() });

    act(() => {
      result.current.handleChange('01020312345');
    });

    await waitFor(() => expect(result.current.error).toMatch(/Could not sign in/));

    act(() => {
      result.current.handleChange('0102031234');
      result.current.handleChange('01020312345');
    });

    await waitFor(() => expect(saveMock).toHaveBeenCalledTimes(2));
  });

  it('does not double-submit while sign-in is still running', async () => {
    let resolveSignIn: () => void = () => {};
    saveMock.mockImplementation(() => {
      const pending = new Promise<void>((resolve) => {
        resolveSignIn = resolve;
      });
      return pending;
    });

    const { result } = renderHook(() => useLogin(), { wrapper: makeWrapper() });

    act(() => {
      result.current.handleChange('01020312345');
    });
    expect(saveMock).toHaveBeenCalledTimes(1);
    act(() => {
      result.current.handleChange('0102031234');
      result.current.handleChange('01020312345');
    });

    expect(saveMock).toHaveBeenCalledTimes(1);

    resolveSignIn();
    await act(async () => {});

    act(() => {
      result.current.handleChange('0102031234');
      result.current.handleChange('01020312345');
    });

    expect(saveMock).toHaveBeenCalledTimes(2);
  });
});
