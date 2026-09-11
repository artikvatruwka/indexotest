import { View } from 'react-native';

import { Screen } from '@/shared/ui/screen';
import { ScreenState } from '@/shared/ui/screen-state';
import { ThemedText } from '@/shared/ui/themed-text';

import { usePostQuery } from '../hooks/use-post-query';
import { styles } from './post-details-view.styles';

export function PostDetailsView({ id }: { id: string }) {
  const query = usePostQuery(id);

  return (
    <Screen style={styles.fullBleed}>
      {query.isLoading ? (
        <ScreenState state="loading" />
      ) : query.isError ? (
        <ScreenState
          state="error"
          message="Could not load this post. Check your connection and try again."
          onRetry={() => {
            void query.refetch();
          }}
        />
      ) : !query.data ? (
        <ScreenState state="empty" message="Post not found." />
      ) : (
        <View style={styles.wrapper}>
          <View style={styles.badge}>
            <ThemedText variant="caption" style={styles.badgeText}>
              Post #{query.data.id}
            </ThemedText>
          </View>
          <ThemedText variant="largeTitle">{query.data.title}</ThemedText>
          <ThemedText variant="body">{query.data.body}</ThemedText>
        </View>
      )}
    </Screen>
  );
}
