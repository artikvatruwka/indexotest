import { StyleSheet } from 'react-native';

import { palette, radius, spacing } from '@/shared/theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.card,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: palette.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
});
