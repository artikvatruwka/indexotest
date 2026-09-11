import { StyleSheet, type ViewStyle } from 'react-native';

import { palette, radius, spacing, type } from '@/shared/theme';

export type Variant = 'primary' | 'secondary';

export const variantStyles: Record<Variant, ViewStyle> = {
  primary: { backgroundColor: palette.primary },
  secondary: { backgroundColor: palette.primaryTint },
};

export const variantTextStyles: Record<Variant, { color: string; fontFamily: string }> = {
  primary: { color: '#ffffff', fontFamily: type.headline.fontFamily },
  secondary: { color: palette.primary, fontFamily: type.headline.fontFamily },
};

export const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  pressed: { opacity: 0.7 },
  inactive: { opacity: 0.4 },
  label: { fontSize: 16, lineHeight: 20 },
});
