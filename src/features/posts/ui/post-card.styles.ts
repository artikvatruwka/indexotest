import { StyleSheet } from 'react-native';

import { palette, radius, spacing } from '@/shared/theme';

export const styles = StyleSheet.create({
  pressed: { opacity: 0.7 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: palette.accent,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgeText: { color: palette.foreground },
});
