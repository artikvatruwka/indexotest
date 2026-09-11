import * as SecureStore from 'expo-secure-store';

import { clearAllStorage, loadSession, saveSession } from './storage';

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const setItemMock = SecureStore.setItemAsync as jest.Mock;
const getItemMock = SecureStore.getItemAsync as jest.Mock;
const deleteItemMock = SecureStore.deleteItemAsync as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('session storage', () => {
  it('saves the token under the session key', async () => {
    setItemMock.mockResolvedValue(undefined);

    await saveSession('mock-token');

    expect(setItemMock).toHaveBeenCalledWith('session.token', 'mock-token');
  });

  it('loads the stored token', async () => {
    getItemMock.mockResolvedValue('mock-token');

    await expect(loadSession()).resolves.toBe('mock-token');
  });

  it('loads null when nothing is stored', async () => {
    getItemMock.mockResolvedValue(null);

    await expect(loadSession()).resolves.toBeNull();
  });

  it('clears all storage keys on logout', async () => {
    deleteItemMock.mockResolvedValue(undefined);

    await clearAllStorage();

    expect(deleteItemMock).toHaveBeenCalledWith('session.token');
  });
});
