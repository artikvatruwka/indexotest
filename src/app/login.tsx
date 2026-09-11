import { Stack } from 'expo-router';

import { LoginView } from '@/features/auth/views/login-view';

export default function LoginScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LoginView />
    </>
  );
}
