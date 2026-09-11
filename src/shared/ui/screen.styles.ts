import { StyleSheet } from 'react-native';

import { palette, spacing } from '@/shared/theme';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  content: { flex: 1, padding: spacing.md, gap: spacing.md },
});
