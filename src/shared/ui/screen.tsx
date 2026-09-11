import { View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { styles } from './screen.styles';

export function Screen({
  style,
  edges,
  children,
}: {
  style?: StyleProp<ViewStyle>;
  edges?: Edge[];
  children: React.ReactNode;
}) {
  return (
    <SafeAreaView edges={edges} style={styles.safe}>
      <View style={[styles.content, style]}>{children}</View>
    </SafeAreaView>
  );
}
