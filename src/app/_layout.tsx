import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { SessionProvider, useSession } from '@/entities/session/session-provider';
import { fonts, palette } from '@/shared/theme';

import { AppBootstrap } from './app-bootstrap';

const queryClient = new QueryClient();

function handleSignOut() {
  queryClient.clear();
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider onSignOut={handleSignOut}>
        <AppBootstrap>
          <RootNavigator />
        </AppBootstrap>
      </SessionProvider>
    </QueryClientProvider>
  );
}

function RootNavigator() {
  const { session } = useSession();

  return (
    <ThemeProvider value={DefaultTheme}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: palette.background },
          headerTintColor: palette.primary,
          headerTitleStyle: { fontFamily: fonts.medium },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: palette.background },
        }}
      >
        <Stack.Protected guard={session !== null}>
          <Stack.Screen name="index" />
          <Stack.Screen name="post/[id]" />
        </Stack.Protected>
        <Stack.Protected guard={session === null}>
          <Stack.Screen name="login" />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}
