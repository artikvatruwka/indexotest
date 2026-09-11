import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { SessionProvider } from '@/entities/session/session-provider';
import { loadSession, saveSession } from '@/entities/session/storage';

import { LoginView } from './login-view';

jest.mock('@/entities/session/storage', () => ({
  loadSession: jest.fn(),
  saveSession: jest.fn(),
  clearAllStorage: jest.fn(),
}));

const loadMock = loadSession as jest.Mock;
const saveMock = saveSession as jest.Mock;

function renderView() {
  return render(
    <SessionProvider>
      <LoginView />
    </SessionProvider>,
  );
}

function pressDigits(digits: string) {
  for (const digit of digits) {
    fireEvent.press(screen.getByTestId(`key-${digit}`));
  }
}

beforeEach(() => {
  jest.clearAllMocks();
  loadMock.mockResolvedValue(null);
  saveMock.mockResolvedValue(undefined);
});

describe('LoginView', () => {
  it('shows the title, subtitle, demo code and code input', () => {
    renderView();

    expect(screen.getByText('Welcome to Indexo')).toBeOnTheScreen();
    expect(screen.getByText(/Sign in with your personal ID code/)).toBeOnTheScreen();
    expect(screen.getByText('Demo personal code: 010203-12345')).toBeOnTheScreen();
    expect(screen.getByLabelText('Personal ID code, 0 of 11 digits entered')).toBeOnTheScreen();
  });

  it('signs in via the numpad once the demo code is complete', async () => {
    renderView();

    pressDigits('01020312345');

    await waitFor(() => expect(saveMock).toHaveBeenCalled());
  });

  it('shows an error for an unknown complete code', async () => {
    renderView();

    pressDigits('99999999999');

    expect(await screen.findByText(/does not match/)).toBeOnTheScreen();
  });
});
