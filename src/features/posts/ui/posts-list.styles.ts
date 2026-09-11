import { StyleSheet } from 'react-native';

import { spacing } from '@/shared/theme';

export const styles = StyleSheet.create({
  list: { flex: 1 },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  footer: { padding: spacing.md },
});
