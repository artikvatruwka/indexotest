import { ActivityIndicator, Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { palette } from '../theme';
import { ThemedText } from './themed-text';
import { styles, variantStyles, variantTextStyles, type Variant } from './button.styles';

export function getButtonStyles(variant: Variant, inactive: boolean, pressed: boolean) {
  return [
    styles.base,
    variantStyles[variant],
    inactive && styles.inactive,
    pressed && styles.pressed,
  ];
}

export function getMergedButtonStyles(
  variant: Variant,
  inactive: boolean,
  pressed: boolean,
  style?: StyleProp<ViewStyle>,
) {
  return [...getButtonStyles(variant, inactive, pressed), style];
}

export function Button({
  variant = 'primary',
  title,
  loading = false,
  disabled = false,
  style,
  testID,
  onPress,
}: {
  variant?: Variant;
  title: string;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  onPress?: () => void;
}) {
  const inactive = disabled || loading;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => getMergedButtonStyles(variant, inactive, pressed, style)}
    >
      {loading ? (
        <ActivityIndicator
          testID="button-spinner"
          color={variant === 'primary' ? '#ffffff' : palette.primary}
        />
      ) : (
        // Stryker disable next-line ArrayDeclaration: static style composition, not behavior
        <ThemedText style={[styles.label, variantTextStyles[variant]]}>{title}</ThemedText>
      )}
    </Pressable>
  );
}
