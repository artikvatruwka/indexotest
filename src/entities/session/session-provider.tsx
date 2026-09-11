import * as Crypto from 'expo-crypto';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { clearAllStorage, loadSession, saveSession } from './storage';

export interface Session {
  token: string;
}

export function sessionFromToken(token: string | null): Session | null {
  return token ? { token } : null;
}

interface SessionContextValue {
  session: Session | null;
  isReady: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({
  onSignOut,
  children,
}: {
  onSignOut?: () => void;
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Stryker disable ArrayDeclaration: constant deps, behavior-identical (`next-line` misses deps-array mutants)
  // Stryker disable ConditionalExpression,BlockStatement,BooleanLiteral: cancellation cleanup, covered by the unmount test (perTest attribution gap)
  useEffect(() => {
    let cancelled = false;
    void loadSession()
      .then((token) => {
        if (!cancelled) {
          setSession(sessionFromToken(token));
          setIsReady(true);
        }
      })
      .catch(() => {
        setIsReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async () => {
    const token = Crypto.randomUUID();
    await saveSession(token);
    setSession({ token });
  }, []);

  const signOut = useCallback(async () => {
    await clearAllStorage();
    setSession(null);
    onSignOut?.();
  }, [onSignOut]);
  // Stryker restore ArrayDeclaration,ConditionalExpression,BlockStatement,BooleanLiteral

  const value = { session, isReady, signIn, signOut };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
