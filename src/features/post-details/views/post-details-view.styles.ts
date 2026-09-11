import { StyleSheet } from 'react-native';

import { palette, radius, spacing } from '@/shared/theme';

export const styles = StyleSheet.create({
  fullBleed: { padding: 0 },
  wrapper: { flex: 1, padding: spacing.md, gap: spacing.md },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: palette.accent,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgeText: { color: palette.foreground },
});
