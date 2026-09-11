import type { TextStyle } from 'react-native';

export const palette = {
  primary: '#0f584f',
  primaryTint: '#e9fbf9',
  accent: '#f7ea48',
  foreground: '#1a1a1a',
  muted: '#595959',
  background: '#ffffff',
  card: '#ffffff',
  border: '#e5e5e5',
  destructive: '#d9262c',
} as const;

export const spacing = {
  sm: 8,
  md: 16,
  lg: 24,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  full: 9999,
} as const;

export const fonts = {
  regular: 'Gibson_400Regular',
  medium: 'Gibson_500Medium',
  semibold: 'Gibson_600SemiBold',
} as const;

export const type = {
  largeTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontFamily: fonts.semibold,
    color: palette.foreground,
  },
  headline: { fontSize: 17, lineHeight: 22, fontFamily: fonts.medium, color: palette.foreground },
  body: { fontSize: 16, lineHeight: 22, fontFamily: fonts.regular, color: palette.foreground },
  subhead: { fontSize: 14, lineHeight: 18, fontFamily: fonts.regular, color: palette.muted },
  caption: { fontSize: 12, lineHeight: 16, fontFamily: fonts.medium, color: palette.muted },
} as const satisfies Record<string, TextStyle>;
