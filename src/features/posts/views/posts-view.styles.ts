import { StyleSheet } from 'react-native';
import type { Edge } from 'react-native-safe-area-context';

import { palette, spacing } from '@/shared/theme';

export const screenEdges: Edge[] = ['top', 'left', 'right'];

export const styles = StyleSheet.create({
  fullBleed: { padding: 0 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    height: 52,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.border,
  },
  signOut: { color: palette.primary },
});
