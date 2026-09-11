import { ActivityIndicator, View } from 'react-native';
import { palette } from '../theme';
import { Button } from './button';
import { ThemedText } from './themed-text';
import { styles } from './screen-state.styles';

export function ScreenState({
  state,
  message,
  onRetry,
}: {
  state: 'loading' | 'error' | 'empty';
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <View testID={`${state}-state`} style={styles.wrapper}>
      {state === 'loading' && (
        <ActivityIndicator testID="loading-spinner" size="large" color={palette.primary} />
      )}
      {(state === 'error' || state === 'empty') && (
        <ThemedText variant="headline" style={styles.message}>
          {message}
        </ThemedText>
      )}
      {state === 'error' && onRetry && (
        <Button variant="secondary" title="Try again" onPress={onRetry} />
      )}
    </View>
  );
}
