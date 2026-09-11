import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';

import { styles } from './card.styles';

export function Card({
  style,
  ...props
}: React.ComponentProps<typeof View> & { style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]} {...props} />;
}
