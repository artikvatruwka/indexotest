import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'session.token';

export function saveSession(token: string): Promise<void> {
  return SecureStore.setItemAsync(TOKEN_KEY, token);
}

export function loadSession(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export function clearAllStorage(): Promise<void> {
  return SecureStore.deleteItemAsync(TOKEN_KEY);
}
