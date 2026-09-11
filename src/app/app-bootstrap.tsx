import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import gibsonRegular from '../../assets/fonts/gibson_400Regular.otf';
import gibsonMedium from '../../assets/fonts/gibson_500Medium.otf';
import gibsonSemibold from '../../assets/fonts/gibson_600SemiBold.otf';
import { useSession } from '@/entities/session/session-provider';

void SplashScreen.preventAutoHideAsync();

export function AppBootstrap({ children }: { children: React.ReactNode }) {
  const { isReady: sessionReady } = useSession();
  const [fontsLoaded, fontError] = useFonts({
    Gibson_400Regular: gibsonRegular,
    Gibson_500Medium: gibsonMedium,
    Gibson_600SemiBold: gibsonSemibold,
  });

  useEffect(() => {
    if ((fontsLoaded || fontError) && sessionReady) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, sessionReady]);

  if ((!fontsLoaded && !fontError) || !sessionReady) {
    return null;
  }

  return <>{children}</>;
}
