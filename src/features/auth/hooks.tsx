import { useState } from 'react';

import { PERSONAL_CODE_LENGTH, validatePersonalCode } from '@/entities/session/model';
import { useSession } from '@/entities/session/session-provider';
import { VALID_PERSONAL_CODE } from '@/shared/config/constants';

export function useLogin() {
  const { signIn } = useSession();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = (candidate: string) => {
    if (submitting) {
      return;
    }
    if (!validatePersonalCode(candidate, VALID_PERSONAL_CODE)) {
      setError('This personal code does not match our records.');
      return;
    }
    setSubmitting(true);
    void signIn()
      .catch(() => {
        setError('Could not sign in. Please try again.');
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleChange = (next: string) => {
    setCode(next);
    setError(null);
    if (next.length === PERSONAL_CODE_LENGTH) {
      validate(next);
    }
  };

  return { code, error, handleChange };
}

export function useSignOut() {
  const { signOut } = useSession();
  return signOut;
}
