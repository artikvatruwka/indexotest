import { StyleSheet } from 'react-native';

import { palette, spacing } from '@/shared/theme';

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  message: { textAlign: 'center', color: palette.muted },
});
