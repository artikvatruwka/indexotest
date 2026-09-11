import type { Post } from '@/entities/post/model';
import { Pressable, View } from 'react-native';

import { Card } from '@/shared/ui/card';
import { ThemedText } from '@/shared/ui/themed-text';
import { styles } from './post-card.styles';

export function postCardPressedStyle(pressed: boolean) {
  return pressed && styles.pressed;
}

export function PostCard({
  post,
  onPress,
  testID,
}: {
  post: Post;
  onPress: () => void;
  testID?: string;
}) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`Post ${String(post.id)}: ${post.title}`}
      onPress={onPress}
      style={({ pressed }) => postCardPressedStyle(pressed)}
    >
      <Card>
        <View style={styles.badge}>
          <ThemedText variant="caption" style={styles.badgeText}>
            #{post.id}
          </ThemedText>
        </View>
        <ThemedText variant="headline">{post.title}</ThemedText>
        {/* Native clamp gives the short preamble — no JS truncation logic. */}
        <ThemedText variant="subhead" numberOfLines={2}>
          {post.body}
        </ThemedText>
      </Card>
    </Pressable>
  );
}
