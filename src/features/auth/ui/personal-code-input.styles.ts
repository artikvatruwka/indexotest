import { StyleSheet } from 'react-native';

import { palette, radius, spacing, fonts } from '@/shared/theme';

const MAX_CELLS_WIDTH = 440;

export const styles = StyleSheet.create({
  wrapper: { flex: 1, alignSelf: 'stretch', alignItems: 'center' },
  cellsSection: {
    flex: 1,
    width: '100%',
    maxWidth: MAX_CELLS_WIDTH,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  cells: { flexDirection: 'row', alignItems: 'center', gap: 4, width: '100%' },
  cell: {
    flex: 1,
    height: 56,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellActive: { borderColor: palette.primary },
  cellDigit: { fontSize: 26, lineHeight: 32, fontFamily: fonts.medium },
  dash: { width: 14, textAlign: 'center', alignSelf: 'center', color: palette.muted },
  errorSlot: {
    minHeight: 32,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: { color: palette.destructive, textAlign: 'center' },
  pad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    width: '100%',
    maxWidth: 320,
    paddingBottom: spacing.md,
  },
  key: {
    width: '30%',
    height: 60,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keySpacer: { width: '30%', height: 60 },
  keyPressed: { backgroundColor: palette.primaryTint },
  keyLabel: { fontSize: 24, lineHeight: 30, fontFamily: fonts.medium, color: palette.foreground },
});
